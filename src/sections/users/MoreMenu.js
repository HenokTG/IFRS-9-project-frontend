import PropTypes from 'prop-types';

import { useRef, useState } from 'react';

// material
import { useTheme } from '@mui/material/styles';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

import { ThemeMode } from 'config';

// component
import Iconify from 'components/Iconify';
// context and modules
import { axiosInstance } from 'utils/axios';
// ----------------------------------------------------------------------

MoreMenu.propTypes = {
  renewActivation: PropTypes.string,
  updateLink: PropTypes.string,
  deletePath: PropTypes.string,
  setDeleted: PropTypes.func,
};

export default function MoreMenu({ openUpdateModal, deletePath, renewActivation, setRefreshTime }) {
  const theme = useTheme();

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (deletePath) => {
    axiosInstance
      .delete(deletePath)
      .then((res) => {
        setRefreshTime(Date.now());
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  const handleRenewActivation = (renewActivation) => {
    axiosInstance
      .get(renewActivation)
      .then(() => {
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error.response.data.detail);
      });
  };

  const getMenuColor = (baseColor) =>
    theme.palette.mode === ThemeMode.DARK ? `${baseColor}.dark` : `${baseColor}.main`;

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: getMenuColor('success') }} onClick={() => handleRenewActivation(renewActivation)}>
          <ListItemIcon>
            <Iconify icon="material-symbols:add-reaction-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Renew Activation Link" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={openUpdateModal} sx={{ color: getMenuColor('warning') }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: getMenuColor('error') }} onClick={() => handleDelete(deletePath)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
