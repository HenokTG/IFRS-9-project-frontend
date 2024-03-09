import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import Iconify from '../../components/Iconify';

// mocks_ and context and modules
import { axiosInstance } from '../../utils/axios';
import { useGlobalContext } from '../../context';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Dashboard',
    icon: 'eva:home-fill',
    linkTo: '/app/dashboard',
  },
  {
    label: 'User profile',
    icon: 'eva:person-fill',
    linkTo: '/app/app-settings/user-profile',
  },
];

// ----------------------------------------------------------------------

AccountPopover.propTypes = {
  account: PropTypes.object,
};

export default function AccountPopover({ account }) {
  const { setLoggedIn, setProfilePk, setProfile } = useGlobalContext();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    axiosInstance.post('api/agent/logout/blacklist/', {
      refresh_token: localStorage.getItem('refresh_token'),
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    axiosInstance.defaults.headers.Authorization = null;
    setOpen(null);
    setLoggedIn(false);
    setProfilePk('');
    setProfile({});
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="profile" sx={{ width: 48, height: 48 }}>
          <Avatar src={account.avatorURL} alt="avator" sx={{ width: 48, height: 48 }} />
        </Avatar>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 2.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="caption" noWrap>
            {account.institute}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', my: 0.25 }} noWrap>
            {account.email}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.phone}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              <Iconify
                icon={option.icon}
                sx={{
                  width: 16,
                  height: 16,
                  color: 'primary.main',
                  mx: 1,
                }}
              />
              <Typography variant="body2" sx={{ color: 'primary.main' }} noWrap>
                {option.label}
              </Typography>
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem
          sx={{ m: 1, color: 'error.main' }}
          key="Logout"
          to="/login"
          component={RouterLink}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
