// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
} from '@mui/material';

// date-picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';

// utils
import { fShortenNumber } from 'utils/formatNumber';

// components
import Iconify from 'components/Iconify';

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

export function AppWidgetSummary({ sumTotal, loading, ...other }) {
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

      {loading ? (
        <CircularLoader size={25} sx={{ pb: 2 }} />
      ) : (
        <Typography variant="h3">{total !== 0 ? fShortenNumber(total) : '-'}</Typography>
      )}

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </Card>
  );
}

export function CircularLoader({ size, sx }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
      <CircularProgress size={size ?? 50} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export const ReportingMonthSelect = ({ summaryDate, setSummaryDate, isDarkMode }) => {
  const { approvedResults } = useGlobalContext();

  const handleChange = (event) => {
    setSummaryDate(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <InputLabel id="reporting-month-select-label">Reporting Month</InputLabel>
      <Select
        labelId="reporting-month-select-label"
        id="reporting-month-select-small"
        value={summaryDate}
        label="Reporting Month"
        onChange={handleChange}
        sx={{ color: isDarkMode ? 'white' : 'black' }}
      >
        {approvedResults.map((repoMonth) => (
          <MenuItem key={repoMonth.monthLabel} value={repoMonth.monthLabel}>
            {repoMonth.monthLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

ReportingMonthSelect.propTypes = {
  summaryDate: PropTypes.string,
  setMonth: PropTypes.func,
};

export const MonthPicker = ({ month, setMonth, sx }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DesktopDatePicker
      name="summaryMonth"
      type="date"
      value={month}
      onChange={() => false}
      onYearChange={(newValue) => {
        setMonth(newValue);
      }}
      inputFormat="MMMM, YYYY"
      disableMaskedInput
      openTo="month"
      views={['month', 'year']}
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
