import { alpha } from '@mui/material/styles';

import { ThemeMode } from 'config';

// ----------------------------------------------------------------------

export default function Backdrop(theme) {
  const isDarkMode = theme.palette.mode === ThemeMode.DARK;

  const varLow = alpha(theme.palette.grey[isDarkMode ? 200 : 900], 0.01);
  const varHigh = alpha(theme.palette.grey[isDarkMode ? 200 : 900], 1);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: [
            `rgb(22,28,36)`,
            `-moz-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `-webkit-linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
            `linear-gradient(75deg, ${varLow} 0%, ${varHigh} 100%)`,
          ],
          '&.MuiBackdrop-invisible': {
            background: 'transparent',
          },
        },
      },
    },
  };
}
