import React from 'react';
import PropTypes from 'prop-types';

// date-picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// @mui
import { TextField } from '@mui/material';

const DatePicker = ({ picekerName, pickerLabel, date, setDate, sx }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      //   id="datepicker"
      name={picekerName}
      type="date"
      label={pickerLabel}
      value={date}
      onChange={(newValue) => {
        setDate(newValue);
      }}
      inputFormat="MMMM DD, YYYY"
      disableMaskedInput
      openTo="year"
      views={['year', 'month', 'day']}
      renderInput={(params) => <TextField {...params} required variant="standard" sx={sx} />}
      OpenPickerButtonProps={{ color: 'primary' }}
    />
  </LocalizationProvider>
);

DatePicker.propTypes = {
  picekerName: PropTypes.string,
  picekerLabel: PropTypes.string,
  date: PropTypes.any,
  setDate: PropTypes.func,
  sx: PropTypes.object,
};

export default DatePicker;
