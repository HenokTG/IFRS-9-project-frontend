import { useState, useEffect } from 'react';

// @mui
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Typography,
  InputAdornment,
  TextField,
  FormControl,
  MenuItem,
} from '@mui/material';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
import { AssumedECLInputData } from 'utils/formInputPropsData';
import { handleECLAnalysis } from '_apiAxios/handle-all-analysis';

// components
import Page from 'components/Page';
import { FormProvider, FileUploadField } from 'components/hook-form';
import ReportDateSaveOnServer from './ReportDateSaveOnServer';
import AnalysisProgressTracker from './ProgressTracker';
import AnalysisCardHeader from './AnalysisCardHeader';

// ----------------------------------------------------------------------

export default function ECLAnalysis() {
  const { analysisProgress } = useGlobalContext();

  const [filesList, setFilesList] = useState([]);

  const [reportDate, setReportDate] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const impValues = { date: reportDate, isSave: isSwitchOn, filesList };

  const initialState = {
    analysisCode: 'ECL Progress',
    stage: 0,
    status: 'success',
    title: 'ECL Analysis to start',
    total: 70,
  };

  const [currentState, setCurrentState] = useState(initialState);

  useEffect(() => {
    if (analysisProgress.length > 0) {
      const currentSt = analysisProgress[analysisProgress.length - 1];
      setCurrentState(currentSt);

      const isHideProgress = currentSt.stage === 0 || currentSt.stage === 1000;

      setShowProgress(!isHideProgress);
    }
  }, [analysisProgress]);

  return (
    <Page title="ECL Analysis">
      <FormProvider onSubmit={(e) => handleECLAnalysis(e, impValues)}>
        <Card sx={{ px: { xs: 1, sm: 4 }, py: 2, mx: { xs: 0, sm: 4, lg: 15 }, borderRadius: 1 }}>
          <AnalysisCardHeader title="ECL ANALYSIS" />

          <CardContent sx={{ px: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <FileUploadField setFilesList={setFilesList} maxFiles={2} />
                </FormControl>
              </Grid>
              <Grid sx={{ mx: { xs: 2, sm: 4, lg: 20 }, mb: 3 }} xs={12} item>
                <Typography align="center" variant="h6" gutterBottom sx={{ color: 'success.main', mb: 3 }}>
                  Assumptions
                </Typography>
                <Grid container spacing={{ xs: 2, x4: 1, sm: 2, lg: 3 }}>
                  {AssumedECLInputData.map((elem) => {
                    const { fieldName_, fieldLable_, fieldDefaultValue_ } = elem;
                    return (
                      <Grid item xs={12} sm={6} key={fieldName_}>
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
                                  backgroundColor: (theme) => theme.palette.primary.light,
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
                  <Grid item xs={12} sm={6}>
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

              <ReportDateSaveOnServer
                reportDate={reportDate}
                setReportDate={setReportDate}
                isSwitchOn={isSwitchOn}
                setIsSwitchOn={setIsSwitchOn}
              />
            </Grid>
          </CardContent>
          <CardActions>
            {showProgress ? (
              <AnalysisProgressTracker
                currentState={currentState}
                setShowProgress={setShowProgress}
                downloadExcelAPI={`ecl-analysis/api/${currentState.taskID || 'no-id'}/download-ecl`}
              />
            ) : (
              <Button size="large" color="primary" variant="contained" type="submit" sx={{ width: '100%' }}>
                Start computation
              </Button>
            )}
          </CardActions>
        </Card>
      </FormProvider>
    </Page>
  );
}
