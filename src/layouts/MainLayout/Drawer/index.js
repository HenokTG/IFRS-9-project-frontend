import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer } from '@mui/material';

// project import
import { DRAWER_WIDTH } from 'config';
import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';

import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

const MainDrawer = ({ window }) => {
  const theme = useTheme();
  const matchDownLG = useResponsive('down', 'lg');

  const { isDrawerOpen, setIsDrawerOpen } = useConfig();

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={isDrawerOpen} />, [isDrawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
      {!matchDownLG ? (
        <MiniDrawerStyled variant="permanent" open={isDrawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(!isDrawerOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

MainDrawer.propTypes = {
  open: PropTypes.bool,
  window: PropTypes.object,
  handleDrawerToggle: PropTypes.func,
};

export default MainDrawer;
