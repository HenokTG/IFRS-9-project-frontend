import PropTypes from 'prop-types';

import { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project import
import Dot from 'components/Dot';

import { MenuOrientation, ThemeMode } from 'config';

import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();

  const downLG = useResponsive('down', 'lg');

  const { menuOrientation, isDrawerOpen, setIsDrawerOpen, openNavItem, setOpenNavItem } = useConfig();

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = {
    component: forwardRef((props, ref) => <Link {...props} to={item.path} target={itemTarget} ref={ref} />),
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.path, target: itemTarget };
  }

  const itemIcon = item.icon;

  const isSelected = openNavItem.findIndex((id) => id === item.id) > -1;

  const pathname = document.location.pathname;

  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.path)) {
      setOpenNavItem([item.id]);
    }

    // eslint-disable-next-line
  }, [pathname]);

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === ThemeMode.DARK && isDrawerOpen ? 'text.primary' : 'primary.main';

  return (
    <>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <ListItemButton
          {...listItemProps}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: isDrawerOpen ? `${level * 28}px` : 1.5,
            py: !isDrawerOpen && level === 1 ? 1.25 : 1,
            ...(isDrawerOpen && {
              '&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
              },
              '&.Mui-selected': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
                borderRight: `2px solid ${theme.palette.primary.main}`,
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
                },
              },
            }),
            ...(!isDrawerOpen && {
              '&:hover': {
                bgcolor: 'transparent',
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent',
                },
                bgcolor: 'transparent',
              },
            }),
          }}
          {...(downLG && {
            onClick: () => setIsDrawerOpen(false),
          })}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                color: isSelected ? iconSelectedColor : textColor,
                ...(!isDrawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.lighter',
                  },
                }),
                ...(!isDrawerOpen &&
                  isSelected && {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.900' : 'primary.lighter',
                    '&:hover': {
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.darker' : 'primary.lighter',
                    },
                  }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(isDrawerOpen || (!isDrawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                  {item.title}
                </Typography>
              }
            />
          )}
          {(isDrawerOpen || (!isDrawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          {...listItemProps}
          disabled={item.disabled}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            ...(isDrawerOpen && {
              '&:hover': {
                bgcolor: 'transparent',
              },
              '&.Mui-selected': {
                bgcolor: 'transparent',
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: 'transparent',
                },
              },
            }),
            ...(!isDrawerOpen && {
              '&:hover': {
                bgcolor: 'transparent',
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent',
                },
                bgcolor: 'transparent',
              },
            }),
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 36,
                ...(!isDrawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }),
                ...(!isDrawerOpen &&
                  isSelected && {
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  }),
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}

          {!itemIcon && (
            <ListItemIcon
              sx={{
                color: isSelected ? 'primary.main' : 'secondary.main',
                ...(!isDrawerOpen && {
                  borderRadius: 1.5,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }),
                ...(!isDrawerOpen &&
                  isSelected && {
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  }),
              }}
            >
              <Dot size={4} color={isSelected ? 'primary' : 'secondary'} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={
              <Typography variant="h6" color="inherit">
                {item.title}
              </Typography>
            }
          />
          {(isDrawerOpen || (!isDrawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      )}
    </>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
