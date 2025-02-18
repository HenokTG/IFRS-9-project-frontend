import React from 'react';

import { Grid, FormControlLabel, Switch } from '@mui/material';
import DatePicker from 'components/hook-form/DatePicker';

import useResponsive from 'hooks/useResponsive';

// ----------------------------------------------------------------------

function ReportDateSaveOnServer({ reportDate, setReportDate, isSwitchOn, setIsSwitchOn }) {
  const downSM = useResponsive('down', 'sm');

  return (
    <Grid
      item
      sx={{
        mx: { xs: 2, sm: 4, lg: 16 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: downSM ? 'wrap' : 'nowrap',
        gap: 4,
      }}
      xs={12}
    >
      <DatePicker
        fullWidth={downSM}
        picekerName="reportingDate"
        pickerLabel="Select reporting date"
        date={reportDate}
        setDate={setReportDate}
      />
      <FormControlLabel
        control={
          <Switch
            size="medium"
            checked={isSwitchOn}
            onChange={() => {
              setIsSwitchOn(!isSwitchOn);
            }}
            color="success"
          />
        }
        label={isSwitchOn ? 'Summary will be save to database' : 'Check this to save the result to database'}
        componentsProps={{
          typography: { variant: 'subtitle1', sx: { color: isSwitchOn ? 'success.main' : 'warning.main' } },
        }}
      />
    </Grid>
  );
}

export default ReportDateSaveOnServer;
