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
} from '@mui/material';

// components
import Page from '../../components/Page';
import AnalysisProgressTracker from './analysis-progress-tracker';
import { DatePicker, FormProvider } from '../../components/hook-form';

// context and modules
import { scenarioData, minMaxFLIValues } from '../../utils/formInputPropsData';
import { handleFLIAnalysis } from '../../_apiAxios/handle-all-analysis';
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

  const [taskIdFLI, setTaskIdFLI] = useState('');

  const [reportDate, setReportDate] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [macroProcess, setMacroProcess] = useState({
    analysisCode: 'FLI Progress',
    stage: 0,
    status: 'success',
    title: 'Macro Analaysis on CCF',
    total: 70,
  });

  const impValues = { date: reportDate, isSave: isSwitchOn, userId: profilePk, inputData: null };
  const reportDateFileName = reportDate ? new Date(reportDate).toString() : '';

  return (
    <Page title="FLI - CCF Analysis">
      <FormProvider onSubmit={(e) => handleFLIAnalysis(e, impValues, setMacroProcess, setTaskIdFLI)}>
        <Card sx={{ px: 4, py: 2, mx: 15, borderRadius: 1 }}>
          <CardHeader
            title="FLI - CCF ANALYSIS"
            subheader="Fill all Required (*) Fields"
            sx={{ backgroundColor: 'grey.300', padding: 1, borderRadius: 1 }}
            titleTypographyProps={{ color: 'success.dark', variant: 'h3', lineHeight: 1.75, align: 'center' }}
            subheaderTypographyProps={{ color: 'warning.main', variant: 'subtitle1', align: 'center' }}
          />
          <CardContent>
            <Grid container spacing={3} sx={{ margin: '-1rem 0 0 -0.75rem' }}>
              <Grid item lg={12}>
                <FormControl fullWidth required>
                  <FormLabel sx={{ textAlign: 'center', mb: 1, color: 'info.main' }}>Select Excel File</FormLabel>
                  <FormControlLabel
                    control={
                      <TextField
                        required
                        name="uploadedFile"
                        type="file"
                        size="small"
                        sx={{ width: '100%', color: 'info.main' }}
                        InputProps={{
                          inputProps: {
                            accept: '.xlsx',
                            sx: { color: '#13e247' },
                          },
                        }}
                      />
                    }
                  />
                </FormControl>
              </Grid>

              <Grid sx={{ mx: 20, mb: 3 }} lg={12} item>
                <Typography align="center" variant="h6" gutterBottom sx={{ color: 'success.main', mb: 3 }}>
                  Assumptions
                </Typography>
                <Grid container spacing={3}>
                  {scenarioData.map((elem) => {
                    const { fieldName_, fieldLable_, fieldDefaultValue_ } = elem;
                    return (
                      <Grid item lg={4} key={fieldName_}>
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
                          }}
                        />
                      </Grid>
                    );
                  })}

                  {minMaxFLIValues.map((extrm) => (
                    <Grid item lg={6} key={extrm.inputName}>
                      <TextField
                        fullWidth
                        name={extrm.inputName}
                        type="number"
                        label={extrm.inputLabel}
                        defaultValue={extrm.fieldDefaultValue_}
                        InputProps={{
                          inputProps: {
                            step: 0.01,
                            min: 1,
                            max: 5,
                          },
                        }}
                      />
                    </Grid>
                  ))}
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
              Start computation
            </Button>
          </CardActions>
        </Card>
        {!!(
          macroProcess.stage !== 0 &&
          macroProcess.stage !== 1000 &&
          !(macroProcess.stage === 600 && macroProcess.analysisCode !== 'PD Progress')
        ) && (
          <AnalysisProgressTracker
            analysisProgress={macroProcess}
            downloadExcelAPI={`http://127.0.0.1:8000/macro-ccf-analysis/api/download-macro/${profilePk}/${reportDateFileName}/${taskIdFLI}`}
          />
        )}
      </FormProvider>
    </Page>
  );
}
