import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Drawer,
  Stack,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';

// project import
import Iconify from 'components/Iconify';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/SimpleBar';
import IconButton from 'components/IconButton';

import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

import ThemeLayout from './ThemeLayout';
import ThemeMenuLayout from './ThemeMenuLayout';
import DefaultThemeMode from './ThemeMode';
import ColorScheme from './ColorScheme';
import ThemeWidth from './ThemeWidth';
import ThemeFont from './ThemeFont';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();
  const { container, fontFamily, mode, presetColor, miniDrawer, themeDirection, menuOrientation } = useConfig();

  // eslint-disable-next-line
  const themeLayout = useMemo(() => <ThemeLayout />, [miniDrawer, themeDirection]);
  // eslint-disable-next-line
  const themeMenuLayout = useMemo(() => <ThemeMenuLayout />, [menuOrientation]);
  // eslint-disable-next-line
  const themeMode = useMemo(() => <DefaultThemeMode />, [mode]);
  // eslint-disable-next-line
  const themeColor = useMemo(() => <ColorScheme />, [presetColor]);
  // eslint-disable-next-line
  const themeWidth = useMemo(() => <ThemeWidth />, [container]);
  // eslint-disable-next-line
  const themeFont = useMemo(() => <ThemeFont />, [fontFamily]);

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const openDisplaySetting = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <ListItemButton divider onClick={openDisplaySetting}>
        <ListItemIcon sx={{ mr: 0 }}>
          <DisplaySettingsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Display Settings" />
      </ListItemButton>

      {/* <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <Tooltip title="Display Settings">
          <IconButton
            color="secondary"
            variant="light"
            sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
            onClick={handleToggle}
            aria-label="settings toggler"
          >
            <DisplaySettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box> */}

      <Drawer
        sx={{
          zIndex: 2001,
        }}
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340,
          },
        }}
      >
        {open && (
          <MainCard
            title="Theme Customization"
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': {
                color: 'background.paper',
                bgcolor: 'primary.main',
                '& .MuiTypography-root': { fontSize: '1rem' },
              },
            }}
            content={false}
            secondary={
              <IconButton shape="rounded" size="small" onClick={handleToggle} sx={{ color: 'background.paper' }}>
                <Iconify icon="ant-design:close-circle-outlined" style={{ fontSize: '1.15rem' }} />
              </IconButton>
            }
          >
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              <Box
                sx={{
                  height: 'calc(100vh - 64px)',
                  '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'transparent',
                      flexDirection: 'row',
                      pl: 1,
                    },
                    '& .MuiAccordionDetails-root': {
                      border: 'none',
                    },
                    '& .Mui-expanded': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <Accordion defaultExpanded sx={{ borderTop: 'none' }}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:layout-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Theme Layout
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose your layout
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeLayout}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:border-inner-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Menu Orientation
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose Vertical or Horizontal Menu Orientation
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMenuLayout}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:highlight-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Theme Mode
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose light or dark mode
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeMode}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:bg-color-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Color Scheme
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose your primary theme color
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeColor}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:border-inner-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Layout Width
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose fluid or container layout
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeWidth}</AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded sx={{ borderBottom: 'none' }}>
                  <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton
                        disableRipple
                        color="primary"
                        sx={{ bgcolor: 'primary.lighter' }}
                        onClick={handleToggle}
                        aria-label="settings toggler"
                      >
                        <Iconify icon="ant-design:font-color-outlined" />
                      </IconButton>
                      <Stack>
                        <Typography variant="subtitle1" color="textPrimary">
                          Font Family
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Choose your font family.
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>{themeFont}</AccordionDetails>
                </Accordion>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;
