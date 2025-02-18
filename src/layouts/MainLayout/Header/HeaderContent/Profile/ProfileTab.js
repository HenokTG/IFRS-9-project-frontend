import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// project import
import Iconify from 'components/Iconify';
import { useGlobalContext } from 'contexts/AppContext';

import Customization from '../Customization';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const MENU_OPTIONS = [
  {
    label: 'My profile',
    icon: 'eva:person-fill',
    linkTo: '/my-profile',
  },
  {
    label: 'Dashboard',
    icon: 'eva:pie-chart-2-fill',
    linkTo: '/dashboard',
  },
  {
    label: 'ECL Analysis',
    icon: 'ep:data-analysis',
    linkTo: '/analysis/ecl-analysis',
    requiredRoles: ['Analyst', 'Examiner', 'Client Admin'],
  },
  {
    label: 'ECL Analysis Documents',
    icon: 'streamline:download-file',
    linkTo: '/documents-download/ecl-analysis',
  },
  {
    label: 'Term Loan Results',
    icon: 'mdi:report-box',
    linkTo: '/report/term-loan',
  },
  {
    label: 'ECL Analysis Guide',
    icon: 'fluent-mdl2:documentation',
    linkTo: '/documentation/ecl-analysis',
  },
  {
    label: 'Analsis Configurations',
    icon: 'eva:settings-fill',
    linkTo: '/app-settings/configurations',
    requiredRoles: ['Client Admin'],
  },
  {
    label: 'Users Management',
    icon: 'eva:people-fill',
    linkTo: '/users-management',
    requiredRoles: ['Client Admin'],
  },
];

const ProfileTab = ({ handleLogout, handleClose }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loggedIn, profile } = useGlobalContext();

  const [selectedItem, setSelectedItem] = useState(pathname);

  const handleListItemClick = (event, gotoRoute) => {
    setSelectedItem(gotoRoute);
    navigate(gotoRoute);
    handleClose(event);
  };

  const allowedProfileMenu = MENU_OPTIONS.filter((item) => {
    const userRole = item.requiredRoles;

    return item.isPubic || (loggedIn && (!userRole || userRole.includes(profile.role)));
  });

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      {allowedProfileMenu.map((item) => (
        <ListItemButton
          divider
          selected={selectedItem === item.linkTo}
          onClick={(event) => handleListItemClick(event, item.linkTo)}
        >
          <ListItemIcon sx={{ mr: 0 }}>
            <Iconify sx={{ height: 20, width: 20 }} icon={item.icon} />
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}

      <Customization />

      <ListItemButton sx={{ color: 'error.dark', my: 1 }} onClick={handleLogout}>
        <ListItemIcon sx={{ mr: 0 }}>
          <Iconify sx={{ height: 20, width: 20 }} icon="ant-design:logout-outlined" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func,
  handleClose: PropTypes.func,
};

export default ProfileTab;
