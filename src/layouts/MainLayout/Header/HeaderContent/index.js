// material-ui
import { Stack, Box } from '@mui/material';

// project import
import { MenuOrientation } from 'config';

import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';

import DrawerHeader from 'layouts/MainLayout/Drawer/DrawerHeader';

import Profile from './Profile';
import Notification from './Notification';
import ThemeModeSwitch from './ThemeModeSwitch';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useResponsive('down', 'lg');

  return (
    <Stack sx={{ width: '100%' }} flexDirection="row" justifyContent="flex-end">
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open />}

      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <ThemeModeSwitch />
      <Notification />
      <Profile />
    </Stack>
  );
};

export default HeaderContent;
