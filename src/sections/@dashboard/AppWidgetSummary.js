// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography, TextField } from '@mui/material';
// date-picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// utils
import { fShortenNumber } from '../../utils/formatNumber';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  sumTotal: PropTypes.object.isRequired,
};

export function AppWidgetSummary({ sumTotal, ...other }) {
  const { title, total, icon, color } = sumTotal;
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={36} height={36} />
      </IconWrapperStyle>

      <Typography variant="h3">{total !== 0 ? fShortenNumber(total) : '-'}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}

// ----------------------------------------------------------------------

export const MonthPicker = ({ month, setMonth, sx }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      name="summaryMonth"
      type="date"
      value={month}
      onChange={() => false}
      onMonthChange={(newValue) => {
        setMonth(newValue);
      }}
      inputFormat="MMMM, YYYY"
      disableMaskedInput
      openTo="year"
      views={['year', 'month']}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          variant="outlined"
          placeholder="Select Summary Month"
          sx={{ ...sx, bgcolor: (theme) => theme.palette.grey[100], borderRadius: 1 }}
        />
      )}
      OpenPickerButtonProps={{ color: 'success' }}
    />
  </LocalizationProvider>
);

MonthPicker.propTypes = {
  month: PropTypes.any,
  setMonth: PropTypes.func,
};
