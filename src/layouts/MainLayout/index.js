import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { Box, Container, Toolbar } from '@mui/material';

// project import
import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';

import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const downLG = useResponsive('down', 'lg');
  const matchDownXL = useResponsive('down', 'xl');

  const { container, miniDrawer, menuOrientation, setIsDrawerOpen } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      setIsDrawerOpen(!matchDownXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownXL]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      {!isHorizontal ? <Drawer /> : <HorizontalBar />}
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 0, sm: 2 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
          <Footer />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
