import { useRef, useState } from 'react';

import { useLocation } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tooltip,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';

// project import
import Iconify from 'components/Iconify';
import MainCard from 'components/MainCard';
import IconButton from 'components/IconButton';
import Transitions from 'components/Transitions';

import { ThemeMode } from 'config';
import { useGlobalContext } from 'contexts/AppContext';

import ProfileTab from './ProfileTab';
// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();

  const { profile, handleLogout } = useGlobalContext();

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

  function capitalizeNames(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  const isDarkMode = theme.palette.mode === ThemeMode.DARK;
  const iconBackColorOpen = isDarkMode ? 'grey.200' : 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: isDarkMode ? '#373434' : 'secondary.lighter' },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 0.5, paddingY: '1px' }}>
          <Avatar alt="profile profile" src={profile.photoURL} sx={{ height: 32, width: 32 }} />
          <Typography variant="subtitle1">{profile?.username}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
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
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 250,
                },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 1.5, pt: 2, pb: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            variant="rounded"
                            alt="profile profile"
                            src={profile.photoURL}
                            sx={{ width: 50, height: 50 }}
                          />
                          <Stack>
                            <Typography variant="h6">
                              {profile?.firstName
                                ? `${capitalizeNames(profile.firstName)} ${capitalizeNames(profile?.lastName)}`
                                : capitalizeNames(profile?.username)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {profile?.role}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title="Logout"
                          componentsProps={{ tooltip: { sx: { bgcolor: isDarkMode ? 'warning.light' : '' } } }}
                        >
                          <IconButton color="error" sx={{ color: 'text.primary' }} onClick={handleLogout}>
                            <Iconify icon="ant-design:logout-outlined" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Divider sx={{ bgcolor: 'primary.light', height: 2, my: 1 }} />

                  <ProfileTab handleLogout={handleLogout} handleClose={handleClose} />
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
