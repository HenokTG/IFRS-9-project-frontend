import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Tooltip,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';

// project import
import useResponsive from 'hooks/useResponsive';
import { useGlobalContext } from 'contexts/AppContext';

import Iconify from 'components/Iconify';
import MainCard from 'components/MainCard';
import Transitions from 'components/Transitions';

import { ThemeMode } from 'config';
import { fetchNotifications, markNotificationsAsRead } from '_apiAxios/account';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem',
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none',
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const { unreadNotifications, setUnreadNotifications } = useGlobalContext();

  const matchesXs = useResponsive('down', 'md');

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const isDarkMode = [theme.palette.mode === ThemeMode.DARK];

  const iconBackColorOpen = isDarkMode ? 'grey.200' : 'grey.300';
  const iconBackColor = isDarkMode ? 'background.default' : 'grey.100';

  const [refreshTime, setRefreshTime] = useState(null);
  const [notificationData, setNotificationData] = useState([]);
  const [selectedNoticeID, setSelectedNoticeID] = useState(null);

  useEffect(
    () => {
      if (open) {
        setSelectedNoticeID(null);
        fetchNotifications(1, 5).then(({ notifications }) => {
          setNotificationData(notifications);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, refreshTime]
  );

  const handleClicked = (notice) => {
    setSelectedNoticeID(notice.id);

    if (notice.is_unread) {
      markNotificationsAsRead({ notice_id: notice.id }).then(() => {
        setUnreadNotifications((prev) => prev - 1);
        setRefreshTime(Date.now());
      });
    }
  };

  const handleReadAll = () => {
    markNotificationsAsRead({ is_mark_all: true }).then(() => {
      setUnreadNotifications(0);
      setRefreshTime(Date.now());
    });
  };

  const openLink = (e, goTo) => {
    e.stopPropagation();
    navigate(goTo);
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadNotifications} color="primary">
          <Iconify icon="ant-design:bell-outlined" />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position={matchesXs ? 'top' : 'top-right'}
            sx={{ overflow: 'hidden' }}
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 385,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadNotifications > 0 && (
                        <Tooltip
                          title="Mark all as read"
                          componentsProps={{ tooltip: { sx: { bgcolor: isDarkMode ? 'warning.light' : '' } } }}
                        >
                          <IconButton color="success" size="small" onClick={handleReadAll}>
                            <Iconify icon="ant-design:check-circle-outlined" sx={{ fontSize: '1.5rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '&.Mui-selected': { bgcolor: 'primary.light', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
                      },
                    }}
                  >
                    {notificationData.map((notice) => {
                      const isSelected = notice.id === selectedNoticeID;
                      return (
                        <ListItemButton onClick={() => handleClicked(notice)} divider selected={notice.is_unread}>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                color: `${notice.status}.main`,
                                bgcolor: `${notice.status}.lighter`,
                              }}
                            >
                              {notice.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <Stack sx={{ width: '100%' }}>
                            <ListItemText
                              primary={<Typography variant="h6">{notice.title}</Typography>}
                              secondary={isSelected ? null : notice.noticeDate}
                            />
                            {isSelected && (
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'warning.main', textTransform: 'capitalize' }}
                                    noWrap
                                  >
                                    {notice.priority_level} Priority
                                  </Typography>
                                }
                                secondary={
                                  <Typography paragraph sx={{ fontSize: 12 }}>
                                    {notice.message}
                                  </Typography>
                                }
                              />
                            )}
                            {notice.link && (
                              <Typography
                                sx={{
                                  color: notice.is_unread ? 'warning.main' : 'primary.main',
                                }}
                                variant="caption"
                                onClick={(e) => openLink(e, notice.link)}
                              >
                                {notice.link_label ?? 'Go to'}
                              </Typography>
                            )}
                          </Stack>
                          <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                              {notice.noticezTime}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      );
                    })}

                    <ListItemButton
                      onClick={() => {
                        navigate('/my-notifications');
                        setOpen(false);
                      }}
                      sx={{ textAlign: 'center', py: `${12}px !important` }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary">
                            View All
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
