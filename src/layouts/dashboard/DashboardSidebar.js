import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';

// hooks
import useResponsive from 'hooks/useResponsive';
import { useGlobalContext } from 'contexts/AppContext';

// components
import Label from 'components/Label';
import Scrollbar from 'components/Scrollbar';
import NavSection from 'components/NavSection';
import AccountPopover from './AccountPopover';

// context and modules
import navConfig from './NavConfig';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 3),
  // borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[300],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  const { loggedIn, profile } = useGlobalContext();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const allowedSideMenu = navConfig.filter((item) => {
    const userRole = item.requiredRoles;

    return item.isPubic || (loggedIn && (!userRole || userRole.includes(profile.role)));
  });

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Box component="img" src="/static/img/logo/eba-logo.png" sx={{ width: 250, height: 60 }} />
        <Typography
          color="#191957"
          sx={{ fontFamily: 'Lucida Handwriting', textAlign: 'center', fontSize: 18, py: 2, fontWeight: 'bold' }}
        >
          IFRS-9 Analyzer
        </Typography>
      </Box>

      <NavSection navConfig={allowedSideMenu} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
