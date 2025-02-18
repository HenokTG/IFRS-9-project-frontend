import React from 'react';
import PropTypes from 'prop-types';

// date-picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// @mui
import { TextField } from '@mui/material';

const DatePicker = ({ fullWidth = false, isMonthPicker = true, picekerName, pickerLabel, date, setDate, sx }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      type="date"
      name={picekerName}
      label={pickerLabel}
      value={date || null}
      onChange={(selectedDate) => {
        const newDate = isMonthPicker
          ? new Date(selectedDate.year(), selectedDate.month() + 1, 0)
          : selectedDate.format('YYYY-MM-DD');
        setDate(newDate);
      }}
      inputFormat="MMMM DD, YYYY"
      disableMaskedInput
      openTo={isMonthPicker ? 'month' : 'day'}
      views={isMonthPicker ? ['month', 'year'] : ['day', 'month', 'year']}
      renderInput={(params) => <TextField fullWidth={fullWidth} {...params} required variant="standard" sx={sx} />}
      OpenPickerButtonProps={{ color: 'primary' }}
    />
  </LocalizationProvider>
);

DatePicker.propTypes = {
  picekerName: PropTypes.string,
  picekerLabel: PropTypes.string,
  isMonthPicker: PropTypes.bool,
  fullWidth: PropTypes.bool,
  setDate: PropTypes.func,
  sx: PropTypes.object,
  date: PropTypes.any,
};

export default DatePicker;
