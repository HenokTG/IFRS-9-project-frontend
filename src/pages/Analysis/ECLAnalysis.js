import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// @mui
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button,
  Typography,
  InputAdornment,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
} from '@mui/material';

// components
import Page from '../../components/Page';
import AnalysisProgressTracker from './analysis-progress-tracker';
import { DatePicker, FormProvider } from '../../components/hook-form';

// context and modules
import { AssumedECLInputData } from '../../utils/formInputPropsData';
import { handleECLAnalysis } from '../../_apiAxios/handle-all-analysis';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

export default function ECLAnalysis() {
  const { loggedIn, profilePk } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [taskIdECL, setTaskIdECL] = useState('');

  const [reportDate, setReportDate] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [eclProcess, setEclProcess] = useState({
    analysisCode: 'ECL Progress',
    stage: 0,
    status: 'success',
    title: 'ECL Analysis to start',
    total: 70,
  });

  const impValues = { date: reportDate, isSave: isSwitchOn, userId: profilePk, inputData:null };
  const reportDateFileName = reportDate ? new Date(reportDate).toString() : '';

  return (
    <Page title="ECL Analysis">
      <FormProvider onSubmit={(e) => handleECLAnalysis(e, impValues, setEclProcess, setTaskIdECL)}>
        <Card sx={{ px: 4, py: 2, mx: 15, borderRadius: 1 }}>
          <CardHeader
            title="ECL ANALYSIS"
            subheader="Fill all Required (*) Fields"
            sx={{ backgroundColor: 'grey.300', padding: 1, borderRadius: 1 }}
            titleTypographyProps={{ color: 'success.dark', variant: 'h3', lineHeight: 1.75, align: 'center' }}
            subheaderTypographyProps={{ color: 'warning.main', variant: 'subtitle1', align: 'center' }}
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item lg={12}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ textAlign: 'center', mb: 1, color: 'info.main' }}>Select Input File(s)</FormLabel>
                  <FormControlLabel
                    control={
                      <TextField
                        required
                        name="uploadedFile"
                        type="file"
                        size="small"
                        sx={{ width: '100% ', ml: 4, color: 'info.main' }}
                        InputProps={{
                          inputProps: {
                            accept: '.xlsx,.parquet',
                            multiple: true,
                            size: 260,
                            sx: { color: '#13e247' },
                          },
                        }}
                      />
                    }
                  />
                </FormControl>
              </Grid>
              <Grid sx={{ mx: 25, mb: 3 }} lg={12} item>
                <Typography align="center" variant="h6" gutterBottom sx={{ color: 'success.main', mb: 3 }}>
                  Assumptions
                </Typography>
                <Grid container spacing={3}>
                  {AssumedECLInputData.map((elem) => {
                    const { fieldName_, fieldLable_, fieldDefaultValue_ } = elem;
                    return (
                      <Grid item lg={6} key={fieldName_}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name={fieldName_}
                          label={fieldLable_}
                          defaultValue={fieldDefaultValue_}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="start"
                                sx={{
                                  padding: '1.75rem 1rem',
                                  marginRight: '-0.85rem',
                                  backgroundColor: (theme) => theme.palette.info.lighter,
                                  borderTopRightRadius: (theme) => `${theme.shape.borderRadius}px`,
                                  borderBottomRightRadius: (theme) => `${theme.shape.borderRadius}px`,
                                }}
                              >
                                %
                              </InputAdornment>
                            ),
                            inputProps: {
                              step: 0.01,
                              min: 0,
                              max: 100,
                            },
                          }}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item lg={6}>
                    <TextField
                      fullWidth
                      select
                      name="impairmentStartMonth"
                      type="number"
                      label="Start Impairment on"
                      defaultValue={3}
                    >
                      <MenuItem value={3}>3rd Month</MenuItem>
                      <MenuItem value={6}>6th Month</MenuItem>
                      <MenuItem value={12}>12th Month</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item lg={6}>
                <DatePicker
                  picekerName="reportingDate"
                  pickerLabel="Select reporting date"
                  sx={{ ml: 10 }}
                  date={reportDate}
                  setDate={setReportDate}
                />
              </Grid>

              <Grid item lg={6} alignSelf="end">
                <FormControlLabel
                  name=""
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
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              size="large"
              color="primary"
              variant="contained"
              type="submit"
              sx={{ width: '100%', fontSize: '1.2rem' }}
            >
              Start Analysis
            </Button>
          </CardActions>
        </Card>
        {!!(
          eclProcess.stage !== 0 &&
          eclProcess.stage !== 1000 &&
          !(eclProcess.stage === 600 && eclProcess.analysisCode !== 'PD Progress')
        ) && (
          <AnalysisProgressTracker
            analysisProgress={eclProcess}
            downloadExcelAPI={`http://127.0.0.1:8000/ecl-analysis/api/download-ecl/${profilePk}/${reportDateFileName}/${taskIdECL}`}
          />
        )}
      </FormProvider>
    </Page>
  );
}
