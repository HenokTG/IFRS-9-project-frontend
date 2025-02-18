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
} from '@mui/material';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
import { scenarioData } from 'utils/formInputPropsData';
import { handleFLIAnalysis } from '_apiAxios/handle-all-analysis';

// components
import Page from 'components/Page';
import { FormProvider, FileUploadField } from 'components/hook-form';
import ReportDateSaveOnServer from './ReportDateSaveOnServer';
import AnalysisProgressTracker from './ProgressTracker';
import AnalysisCardHeader from './AnalysisCardHeader';

// ----------------------------------------------------------------------

export default function MacroCCF() {
  const { analysisProgress } = useGlobalContext();

  const [filesList, setFilesList] = useState([]);

  const [reportDate, setReportDate] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const impValues = { date: reportDate, isSave: isSwitchOn, filesList };

  const initialState = {
    analysisCode: 'FLI Progress',
    stage: 0,
    status: 'success',
    title: 'FLI and CCF Analaysis to start',
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
    <Page title="FLI - CCF Analysis">
      <FormProvider onSubmit={(e) => handleFLIAnalysis(e, impValues)}>
        <Card sx={{ px: { xs: 1, sm: 4 }, py: 2, mx: { xs: 0, sm: 4, lg: 15 }, borderRadius: 1 }}>
          <AnalysisCardHeader title="FLI - CCF ANALYSIS" />

          <CardContent sx={{ px: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <FileUploadField setFilesList={setFilesList} maxFiles={1} />
                </FormControl>
              </Grid>

              <Grid sx={{ mx: { xs: 2, sm: 4, lg: 20 }, mb: 3 }} xs={12} item>
                <Typography align="center" variant="h6" gutterBottom sx={{ color: 'success.main', mb: 3 }}>
                  Assumptions
                </Typography>
                <Grid container spacing={{ xs: 2, x4: 1, sm: 2, lg: 3 }}>
                  {scenarioData.map((elem) => {
                    const { fieldName_, fieldLable_, fieldDefaultValue_ } = elem;
                    return (
                      <Grid item xs={12} x4={4} key={fieldName_}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          name={fieldName_}
                          defaultValue={fieldDefaultValue_}
                          label={fieldLable_}
                          InputProps={{
                            inputProps: {
                              step: 0.01,
                              min: 0,
                              max: 100,
                            },
                            endAdornment: (
                              <InputAdornment
                                position="end"
                                sx={{
                                  padding: '1.75rem 0.75rem',
                                  marginRight: '-0.85rem',
                                  backgroundColor: (theme) => theme.palette.primary.light,
                                  borderTopRightRadius: (theme) => `${theme.shape.borderRadius}px`,
                                  borderBottomRightRadius: (theme) => `${theme.shape.borderRadius}px`,
                                }}
                              >
                                %
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    );
                  })}
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
                downloadExcelAPI={`macro-ccf-analysis/api/${currentState.taskID || 'no-id'}/download-macro`}
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
