import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Typography,
  IconButton,
  Stack,
  Container,
  Box,
  Pagination,
} from '@mui/material';

// project import
import useResponsive from 'hooks/useResponsive';
import { useGlobalContext } from 'contexts/AppContext';

import Page from 'components/Page';
import Iconify from 'components/Iconify';
import MainCard from 'components/MainCard';

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

const MyNotifications = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const downSM = useResponsive('down', 'sm');

  const { unreadNotifications, setUnreadNotifications } = useGlobalContext();

  const isDarkMode = [theme.palette.mode === ThemeMode.DARK];

  const [refreshTime, setRefreshTime] = useState(null);
  const [notificationData, setNotificationData] = useState([]);
  const [selectedNoticeID, setSelectedNoticeID] = useState(null);

  const [page, setPage] = useState(1);
  const [paginationProps, setPaginationProps] = useState(null);
  const numberOfPages = paginationProps !== null ? paginationProps.num_pages : -1;

  useEffect(
    () => {
      //   setSelectedNoticeID(null);
      fetchNotifications(page).then((data) => {
        setNotificationData(data.notifications);
        setPaginationProps(data.pagination);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, refreshTime]
  );

  const handleClicked = (notice) => {
    setSelectedNoticeID(notice.id);

    if (notice.is_unread) {
      markNotificationsAsRead({ notice_id: notice.id }).then(() => {
        setUnreadNotifications((prev) => prev - 1);
        // setRefreshTime(Date.now());
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
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Page title="My Notifications">
      <Container maxWidth={false} disableGutters sx={{ mx: 0, p: 0 }}>
        <MainCard
          title="My Notifications"
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
              <Tooltip
                title="Refresh"
                componentsProps={{ tooltip: { sx: { bgcolor: isDarkMode ? 'warning.light' : '' } } }}
              >
                <IconButton
                  color="warning"
                  size="small"
                  onClick={() => {
                    setRefreshTime(Date.now());
                  }}
                >
                  <Iconify icon="ant-design:reload-outlined" sx={{ fontSize: '1.5rem' }} />
                </IconButton>
              </Tooltip>
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
              let priorityColor = 'warning.main';
              if (notice.priority_level === 'high') {
                priorityColor = 'error.main';
              }
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
                      secondary={notice.noticeDate}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: priorityColor, textTransform: 'capitalize' }} noWrap>
                          {notice.priority_level} Priority
                        </Typography>
                      }
                      secondary={
                        <Typography paragraph sx={{ fontSize: 12 }}>
                          {notice.message}
                        </Typography>
                      }
                    />
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
          </List>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 3,
              mb: 2,
            }}
          >
            <Pagination
              count={numberOfPages}
              page={page}
              variant="outlined"
              color="secondary"
              size={downSM ? 'large' : 'medium'}
              hideNextButton={!paginationProps?.has_next}
              hidePrevButton={!paginationProps?.has_previous}
              showFirstButton={paginationProps?.has_previous}
              showLastButton={paginationProps?.has_next}
              onChange={handlePageChange}
            />
          </Box>
        </MainCard>
      </Container>
    </Page>
  );
};

export default MyNotifications;
