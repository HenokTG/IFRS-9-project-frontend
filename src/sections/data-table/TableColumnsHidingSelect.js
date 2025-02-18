import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';

// components
import Iconify from 'components/Iconify';
import useResponsive from 'hooks/useResponsive';

const SelectStyle = styled(Select)(({ theme }) => ({
  '&.MuiSelect-icon': { width: 100 },
}));

// ==============================|| COLUMN HIDING - SELECT ||============================== //

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

export const HidingSelect = ({ visilbeColumns, setVisilbeColumns, allColumns }) => {
  const theme = useTheme();

  const downSM = useResponsive('down', 'sm');

  const [hiddenColumns, setHiddenColumns] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setHiddenColumns(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    setVisilbeColumns(allColumns.filter((c) => !hiddenColumns.includes(c.id)));
  }, [hiddenColumns]);

  return (
    <FormControl>
      <SelectStyle
        id="column-hiding"
        multiple
        displayEmpty
        value={hiddenColumns}
        onChange={handleChange}
        input={<OutlinedInput id="select-column-hiding" placeholder="select column" />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return downSM ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
                <Typography variant="subtitle1">All cols</Typography>
                <Iconify icon="ant-design:eye-filled" width={24} height={24} sx={{ color: 'primary.main' }} />
              </Box>
            ) : (
              <Typography variant="subtitle1" color="primary.main">
                All columns visible
              </Typography>
            );
          }

          if (selected.length > 0 && selected.length === allColumns.length) {
            return downSM ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.error.main }}>
                <Typography variant="subtitle1">All cols</Typography>
                <Iconify icon="ant-design:eye-invisible-filled" width={24} height={24} sx={{ color: 'error.main' }} />
              </Box>
            ) : (
              <Typography variant="subtitle1" color="error.main">
                All columns hidden
              </Typography>
            );
          }

          return downSM ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primary.main }}>
              <Typography variant="subtitle1">({visilbeColumns.length}) cols</Typography>
              <Iconify icon="ant-design:eye-filled" width={24} height={24} sx={{ color: 'primary.main' }} />
            </Box>
          ) : (
            <Typography variant="subtitle1" color="primary.main">
              {visilbeColumns.length} column(s) visible
            </Typography>
          );
        }}
        MenuProps={MenuProps}
        size="small"
        sx={{ height: 36, pr: 1 }}
      >
        {allColumns.map((column) => {
          const ToggleChecked = column.id === '#' ? true : hiddenColumns.indexOf(column.id) < 0;
          return (
            <MenuItem
              key={column.id}
              value={column.id}
              sx={{ bgcolor: 'primary.lighter', '&.Mui-selected': { bgcolor: 'background.paper' } }}
            >
              <Checkbox
                checked={ToggleChecked}
                color="primary"
                checkedIcon={
                  <Box
                    className="icon"
                    sx={{
                      width: 16,
                      height: 16,
                      border: '1px solid',
                      borderColor: 'inherit',
                      borderRadius: 0.25,
                      position: 'relative',
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    <Iconify
                      icon="ant-design:check-outlined"
                      style={{ position: 'absolute', color: theme.palette.primary.light }}
                    />
                  </Box>
                }
              />
              <ListItemText primary={column?.label} />
            </MenuItem>
          );
        })}
      </SelectStyle>
    </FormControl>
  );
};

HidingSelect.propTypes = {
  setVisilbeColumns: PropTypes.func,
  visilbeColumns: PropTypes.array,
  allColumns: PropTypes.array,
};
