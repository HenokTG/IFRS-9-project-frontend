import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Collapse,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from '@mui/material';

// project import
import Dot from 'components/Dot';
import Iconify from 'components/Iconify';
import SimpleBar from 'components/SimpleBar';
import Transitions from 'components/Transitions';

import { MenuOrientation, ThemeMode } from 'config';

import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';

import NavItem from './NavItem';

// mini-menu - wrapper
const PopperStyled = styled(Popper)(({ theme }) => ({
  overflow: 'visible',
  zIndex: 1202,
  minWidth: 180,
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 38,
    left: -5,
    width: 10,
    height: 10,
    backgroundColor: theme.palette.background.paper,
    transform: 'translateY(-50%) rotate(45deg)',
    zIndex: 120,
    borderLeft: `1px solid ${theme.palette.grey.A800}`,
    borderBottom: `1px solid ${theme.palette.grey.A800}`,
  },
}));

// ==============================|| NAVIGATION - LIST COLLAPSE ||============================== //

const NavCollapse = ({ menu, level, parentId, setSelectedItems, selectedItems, setSelectedLevel, selectedLevel }) => {
  const theme = useTheme();
  const { pathname } = useLocation();

  const downLG = useResponsive('down', 'lg');

  const { menuOrientation, isDrawerOpen, setOpenNavItem } = useConfig();
  const navigation = useNavigate();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(null);
    setSelectedLevel(level);
    if (isDrawerOpen) {
      setOpen(!open);
      setSelected(!selected ? menu.id : null);
      setSelectedItems(!selected ? menu.id : '');
      if (menu.path) navigation(`${menu.path}`);
    } else {
      setAnchorEl(event?.currentTarget);
    }
  };

  const handlerIconLink = () => {
    if (!isDrawerOpen) {
      if (menu.path) navigation(`${menu.path}`);
      setSelected(menu.id);
    }
  };

  const handleHover = (event) => {
    setAnchorEl(event?.currentTarget);
    if (!isDrawerOpen) {
      setSelected(menu.id);
    }
  };

  const miniMenuOpened = Boolean(anchorEl);

  const handleClose = () => {
    setOpen(false);
    if (!miniMenuOpened) {
      if (!menu.path) {
        setSelected(null);
      }
    }
    setAnchorEl(null);
  };

  useMemo(() => {
    if (selected === selectedItems) {
      if (level === 1) {
        setOpen(true);
      }
    } else if (level === selectedLevel) {
      setOpen(false);
      if (!miniMenuOpened && !isDrawerOpen && !selected) {
        setSelected(null);
      }
      if (isDrawerOpen) {
        setSelected(null);
      }
    }
  }, [selectedItems, level, selected, miniMenuOpened, isDrawerOpen, selectedLevel]);

  useEffect(() => {
    if (pathname === menu.path) {
      setSelected(menu.id);
    }
    // eslint-disable-next-line
  }, [pathname]);

  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.path === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  useEffect(() => {
    setOpen(false);
    if (!miniMenuOpened) {
      setSelected(null);
    }
    if (miniMenuOpened) setAnchorEl(null);
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (pathname && pathname.includes('product-details')) {
          if (item.path && item.path.includes('product-details')) {
            setSelected(menu.id);
            setOpen(true);
          }
        }
        if (item.path === pathname) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  useEffect(() => {
    if (menu.path === pathname) {
      setOpenNavItem([menu.id]);
      setSelected(menu.id);
      setAnchorEl(null);
      setOpen(true);
    }
  }, [pathname, menu]);

  const navCollapse = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            menu={item}
            level={level + 1}
            parentId={parentId}
          />
        );
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Collapse or Item
          </Typography>
        );
    }
  });

  const isSelected = selected === menu.id;

  const borderIcon = level === 1 ? <Iconify icon="ant-design:border-outlined" style={{ fontSize: '1rem' }} /> : null;
  const menuIcon = menu.icon ?? borderIcon;

  const textColor = theme.palette.mode === ThemeMode.DARK ? 'grey.400' : 'text.primary';
  const iconSelectedColor =
    theme.palette.mode === ThemeMode.DARK && isDrawerOpen ? theme.palette.text.primary : theme.palette.primary.main;
  const popperId = miniMenuOpened ? `collapse-pop-${menu.id}` : undefined;
  const FlexBox = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' };

  return (
    <>
      {menuOrientation === MenuOrientation.VERTICAL || downLG ? (
        <>
          <ListItemButton
            disableRipple
            selected={selected === menu.id}
            {...(!isDrawerOpen && { onMouseEnter: handleClick, onMouseLeave: handleClose })}
            onClick={handleClick}
            sx={{
              pl: isDrawerOpen ? `${level * 28}px` : 1.5,
              py: !isDrawerOpen && level === 1 ? 1.25 : 1,
              ...(isDrawerOpen && {
                '&:hover': {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'primary.lighter',
                },
                '&.Mui-selected': {
                  bgcolor: 'transparent',
                  color: iconSelectedColor,
                  '&:hover': {
                    color: iconSelectedColor,
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'divider' : 'transparent',
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
            {menuIcon && (
              <ListItemIcon
                onClick={handlerIconLink}
                sx={{
                  minWidth: 28,
                  color: selected === menu.id ? 'primary.main' : textColor,
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
                    selected === menu.id && {
                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.900' : 'primary.lighter',
                      '&:hover': {
                        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.darker' : 'primary.lighter',
                      },
                    }),
                }}
              >
                {menuIcon}
              </ListItemIcon>
            )}
            {(isDrawerOpen || (!isDrawerOpen && level !== 1)) && (
              <ListItemText
                primary={
                  <Typography variant="h6" color={selected === menu.id ? 'primary' : textColor}>
                    {menu.title}
                  </Typography>
                }
                secondary={
                  menu.caption && (
                    <Typography variant="caption" color="secondary">
                      {menu.caption}
                    </Typography>
                  )
                }
              />
            )}
            {(isDrawerOpen || (!isDrawerOpen && level !== 1)) &&
              (miniMenuOpened || open ? (
                <Iconify
                  icon="ant-design:up-outlined"
                  style={{ fontSize: '0.625rem', marginLeft: 1, color: theme.palette.primary.main }}
                />
              ) : (
                <Iconify icon="ant-design:down-outlined" style={{ fontSize: '0.625rem', marginLeft: 1 }} />
              ))}

            {!isDrawerOpen && (
              <PopperStyled
                open={miniMenuOpened}
                anchorEl={anchorEl}
                placement="right-start"
                style={{
                  zIndex: 2001,
                }}
                popperOptions={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-12, 1],
                      },
                    },
                  ],
                }}
              >
                {({ TransitionProps }) => (
                  <Transitions in={miniMenuOpened} {...TransitionProps}>
                    <Paper
                      sx={{
                        overflow: 'hidden',
                        mt: 1.5,
                        boxShadow: theme.customShadows.z1,
                        backgroundImage: 'none',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <SimpleBar
                          sx={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 170px)',
                          }}
                        >
                          {navCollapse}
                        </SimpleBar>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </PopperStyled>
            )}
          </ListItemButton>
          {isDrawerOpen && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List sx={{ p: 0 }}>{navCollapse}</List>
            </Collapse>
          )}
        </>
      ) : (
        <>
          <ListItemButton
            id={`boundary-${popperId}`}
            disableRipple
            selected={isSelected}
            onMouseEnter={handleHover}
            onMouseLeave={handleClose}
            onClick={handleHover}
            aria-describedby={popperId}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'transparent',
              },
            }}
          >
            <Box onClick={handlerIconLink} sx={FlexBox}>
              {menuIcon && (
                <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36, color: theme.palette.secondary.dark }}>
                  {menuIcon}
                </ListItemIcon>
              )}
              {!menuIcon && level !== 1 && (
                <ListItemIcon
                  sx={{
                    my: 'auto',
                    minWidth: !menu.icon ? 18 : 36,
                    bgcolor: 'transparent',
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                >
                  <Dot size={4} color={isSelected ? 'primary' : 'secondary'} />
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  <Typography variant="body1" color="inherit" sx={{ my: 'auto' }}>
                    {menu.title}
                  </Typography>
                }
              />
              {miniMenuOpened ? (
                <Iconify icon="ant-design:right-outlined" />
              ) : (
                <Iconify icon="ant-design:down-outlined" />
              )}
            </Box>

            {anchorEl && (
              <PopperStyled
                id={popperId}
                open={miniMenuOpened}
                anchorEl={anchorEl}
                placement="right-start"
                style={{
                  zIndex: 2001,
                }}
                modifiers={[
                  {
                    name: 'offset',
                    options: {
                      offset: [-10, 0],
                    },
                  },
                ]}
              >
                {({ TransitionProps }) => (
                  <Transitions in={miniMenuOpened} {...TransitionProps}>
                    <Paper
                      sx={{
                        overflow: 'hidden',
                        mt: 1.5,
                        py: 0.5,
                        boxShadow: theme.shadows[8],
                        backgroundImage: 'none',
                      }}
                    >
                      <ClickAwayListener onClickAway={handleClose}>
                        <SimpleBar
                          sx={{
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 170px)',
                          }}
                        >
                          {navCollapse}
                        </SimpleBar>
                      </ClickAwayListener>
                    </Paper>
                  </Transitions>
                )}
              </PopperStyled>
            )}
          </ListItemButton>
        </>
      )}
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  parentId: PropTypes.string,
  setSelectedItems: PropTypes.func,
  selectedItems: PropTypes.string,
  setSelectedLevel: PropTypes.func,
  selectedLevel: PropTypes.number,
};

export default NavCollapse;
