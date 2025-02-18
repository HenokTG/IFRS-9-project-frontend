import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton } from '@mui/material';

// project import
import Iconify from 'components/Iconify';

import { MenuOrientation, ThemeMode } from 'config';

import useResponsive from 'hooks/useResponsive';
import useConfig from 'hooks/useConfig';

import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const downLG = useResponsive('down', 'lg');

  const { menuOrientation, isDrawerOpen, setIsDrawerOpen } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  // common header
  const mainHeader = (
    <Toolbar>
      {!isHorizontal ? (
        <IconButton
          aria-label="open drawer"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          edge="start"
          color="secondary"
          variant="light"
          sx={{
            color: 'text.primary',
            bgcolor: isDrawerOpen ? iconBackColorOpen : iconBackColor,
            ml: { xs: 0, lg: -2 },
          }}
        >
          {!isDrawerOpen ? (
            <Iconify icon="ant-design:menu-unfold-outlined" />
          ) : (
            <Iconify icon="ant-design:menu-fold-outlined" />
          )}
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  const isVerWidth = isDrawerOpen ? 'calc(100% - 260px)' : { xs: '100%', lg: 'calc(100% - 60px)' };

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: isHorizontal ? '100%' : isVerWidth,
      // boxShadow: theme.customShadows.z1
    },
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={isDrawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

export default Header;
