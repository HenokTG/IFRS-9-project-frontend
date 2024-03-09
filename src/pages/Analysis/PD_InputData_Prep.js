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
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

// components
import Page from '../../components/Page';
import AnalysisProgressTracker from './analysis-progress-tracker';
import { DatePicker, FormProvider } from '../../components/hook-form';

// context and modules
import { handleOrganization } from '../../_apiAxios/handle-all-analysis';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

export default function MacroCCF() {
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

  const [taskIdPD, setTaskIdPD] = useState('');

  const [reportDate, setReportDate] = useState(null);

  const [pdProcess, setPdProcess] = useState({
    analysisCode: 'PD Progress',
    stage: 0,
    status: 'success',
    title: 'PD Input Data preparation to start',
    total: 70,
  });

  const impValues = { date: reportDate, userId: profilePk, inputData: null };
  const reportDateFileName = reportDate ? new Date(reportDate).toString() : '';

  return (
    <Page title="PD Input Data Preparation">
      <FormProvider onSubmit={(e) => handleOrganization(e, impValues, setPdProcess, setTaskIdPD)}>
        <Card sx={{ mt: 12, px: 4, py: 2, mx: 25, borderRadius: 1 }}>
          <CardHeader
            title="PD INPUT DATA PREPARATION"
            subheader="Fill all Required (*) Fields"
            sx={{ backgroundColor: 'grey.300', padding: 1, borderRadius: 1 }}
            titleTypographyProps={{ color: 'success.dark', variant: 'h3', lineHeight: 1.75, align: 'center' }}
            subheaderTypographyProps={{ color: 'warning.main', variant: 'subtitle1', align: 'center' }}
          />
          <CardContent>
            <Grid container spacing={5}>
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
                            multiple: true,
                            accept: '.xlsx,.parquet',
                            sx: { color: '#13e247' },
                          },
                        }}
                      />
                    }
                  />
                </FormControl>
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
              <Grid item lg={6}>
                <TextField
                  sx={{ width: '60%', ml: '20%' }}
                  required
                  // fullWidth
                  name="monthsToAppend"
                  type="number"
                  label="Number of Months to Append"
                  defaultValue={12}
                  InputProps={{
                    inputProps: {
                      step: 1,
                      min: 1,
                      max: 12,
                    },
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
              Prepare Updated PD Input
            </Button>
          </CardActions>
        </Card>
        {!!(
          pdProcess.stage !== 0 &&
          pdProcess.stage !== 1000 &&
          !(pdProcess.stage === 600 && pdProcess.analysisCode !== 'PD Progress')
        ) && (
          <AnalysisProgressTracker
            analysisProgress={pdProcess}
            downloadExcelAPI={`http://127.0.0.1:8000/pd-input-data-organizer/api/download-pd/${profilePk}/${reportDateFileName}/${taskIdPD}`}
            downloadParquetAPI={`http://127.0.0.1:8000/pd-input-data-organizer/api/download-pd-pickel/${profilePk}/${reportDateFileName}/${taskIdPD}`}
          />
        )}
      </FormProvider>
    </Page>
  );
}
