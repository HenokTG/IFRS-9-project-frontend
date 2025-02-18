// material-ui
import { IconButton } from '@mui/material';

// project import
import Iconify from 'components/Iconify';

// project import
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// ==============================|| CUSTOMIZATION - MODE ||============================== //

const ThemeModeSwitch = () => {
  const { mode, onChangeMode } = useConfig();

  const isLightMode = mode === ThemeMode.LIGHT;

  const handleModeChange = () => {
    onChangeMode(isLightMode ? ThemeMode.DARK : ThemeMode.LIGHT);
  };

  const iconBackColor = isLightMode ? 'grey.100' : 'background.default';

  return (
    <IconButton
      variant="light"
      color="secondary"
      onClick={handleModeChange}
      aria-label="light mode toggle"
      sx={{ color: 'text.primary', bgcolor: iconBackColor, height: 40 }}
    >
      <Iconify icon={isLightMode ? 'ant-design:sun-outlined' : 'ant-design:moon-outlined'} />
    </IconButton>
  );
};

export default ThemeModeSwitch;
