import { useState, useEffect } from 'react';

// @mui
import { Card, CardContent, CardActions, Grid, Button, TextField, FormControl } from '@mui/material';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
import { handleOrganization } from '_apiAxios/handle-all-analysis';

// components
import Page from 'components/Page';
import { DatePicker, FormProvider, FileUploadField } from 'components/hook-form';
import AnalysisProgressTracker from './ProgressTracker';
import AnalysisCardHeader from './AnalysisCardHeader';

// ----------------------------------------------------------------------

export default function PDInputDataPrep() {
  const { analysisProgress } = useGlobalContext();

  const [filesList, setFilesList] = useState([]);
  const [reportDate, setReportDate] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const impValues = { date: reportDate, filesList };

  const initialState = {
    analysisCode: 'PD Progress',
    stage: 0,
    status: 'success',
    title: 'PD Input Data preparation to start',
    total: 70,
  };

  const [currentState, setCurrentState] = useState(initialState);

  useEffect(() => {
    if (analysisProgress.length > 0) {
      const currentSt = analysisProgress[analysisProgress.length - 1];
      setCurrentState(currentSt);

      const isHideProgress = currentSt.stage === 0 || currentSt.stage === 1000 || currentSt.stage === 600;

      setShowProgress(!isHideProgress);
    }
  }, [analysisProgress]);

  return (
    <Page title="PD Input Data Preparation">
      <FormProvider onSubmit={(e) => handleOrganization(e, impValues)}>
        <Card sx={{ px: { xs: 1, sm: 4 }, py: 2, mx: { xs: 0, sm: 4, lg: 15 }, borderRadius: 1 }}>
          <AnalysisCardHeader title="PD INPUT DATA PREPARATION" />

          <CardContent sx={{ px: 0 }}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <FileUploadField setFilesList={setFilesList} maxFiles={2} />
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mx: 2 }}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      fullWidth
                      picekerName="reportingDate"
                      pickerLabel="Select reporting date"
                      setDate={setReportDate}
                      date={reportDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
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
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            {showProgress ? (
              <AnalysisProgressTracker
                currentState={currentState}
                setShowProgress={setShowProgress}
                downloadExcelAPI={`pd-input-data-organizer/api/${currentState.taskID || 'no-id'}/download-pd-excel`}
                downloadParquetAPI={`pd-input-data-organizer/api/${currentState.taskID || 'no-id'}/download-pd-parquet`}
              />
            ) : (
              <Button size="large" color="primary" variant="contained" type="submit" sx={{ width: '100%' }}>
                Prepare Updated PD Input
              </Button>
            )}
          </CardActions>
        </Card>
      </FormProvider>
    </Page>
  );
}
