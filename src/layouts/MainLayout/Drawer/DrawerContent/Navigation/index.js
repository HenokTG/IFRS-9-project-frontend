import { useState, useEffect } from 'react';

// material-ui
import { Box, Typography } from '@mui/material';

// project import
import useConfig from 'hooks/useConfig';
import useResponsive from 'hooks/useResponsive';
import { useGlobalContext } from 'contexts/AppContext';

import { HORIZONTAL_MAX_ITEM, MenuOrientation } from 'config';

import navConfig from './NavConfig';
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const downLG = useResponsive('down', 'lg');

  const { menuOrientation, isDrawerOpen } = useConfig();

  const { loggedIn, profile } = useGlobalContext();

  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const allowedSideMenu = navConfig.filter((item) => {
      const userRole = item.requiredRoles;

      return item.isPubic || (loggedIn && (!userRole || userRole.includes(profile.role)));
    });

    const navItems = [
      {
        id: 'ifrs-9-analysis',
        title: 'IFRS 9 Analysis',
        type: 'group',
        children: allowedSideMenu,
      },
    ];

    setMenuItems(navItems);
  }, [loggedIn]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.length - 1;
  let remItems = [];
  let lastItemId;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.length) {
    lastItemId = menuItems[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.slice(lastItem - 1, menuItems.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
    }));
  }

  const navGroups = menuItems.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  const hasTopPadding = isDrawerOpen && !(isDrawerOpen && isHorizontal);

  return (
    <Box
      sx={{
        pt: hasTopPadding ? 2 : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
