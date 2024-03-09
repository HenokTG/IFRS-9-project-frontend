import * as React from 'react';
import PropTypes from 'prop-types';

// @mui
import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/Download';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Card, CardHeader, CardContent, Button, Typography, Box, Link, CircularProgress } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)(({ theme, status }) => ({
  height: 16,
  borderRadius: 8,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: status === 'success' ? theme.palette.success.main : theme.palette.error.main,
  },
}));

AnalysisProgressTracker.propTypes = {
  analysisProgress: PropTypes.object,
  downloadExcelAPI: PropTypes.string,
  downloadParquetAPI: PropTypes.string,
};

export default function AnalysisProgressTracker({ analysisProgress, downloadExcelAPI, downloadParquetAPI }) {
  const { analysisCode, stage, status, title, total } = analysisProgress;
  const percentage = (stage * 100) / total;

  return (
    <Card sx={{ my: 1, px: 4, py: 2, mx: 15, borderRadius: 1, textAlign: 'center' }}>
      <CardHeader
        title="Progress Tracker"
        subheader={status === 'success' ? 'Processing... / Download ' : 'Error occured'}
        sx={{ backgroundColor: 'grey.300', py: 0.5, borderRadius: 1 }}
        titleTypographyProps={{ color: 'success.dark', variant: 'h6', lineHeight: 1.75, align: 'center' }}
        subheaderTypographyProps={{
          color: status === 'success' ? 'info.main' : 'error.main',
          variant: 'body2',
          align: 'center',
        }}
      />
      <CardContent>
        {stage < total ? (
          <Box sx={{ mx: 2 }}>
            {status !== 'success' && (
              <Button variant="contained" disabled>
                <BugReportIcon color="error" />
                <Typography variant="h6" sx={{ px: 2, py: 1 }} color="error.main">
                  Erorr
                </Typography>
              </Button>
            )}
            <Typography
              variant="body1"
              color={status === 'success' ? 'text.sidebarSubroot' : 'warning.main'}
              align="left"
              sx={{ my: 2 }}
            >
              {title}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel value={percentage} status={status} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ mx: 2 }}>
            {status !== 'success' ? (
              <Button variant="contained" disabled>
                <DangerousIcon color="error" />
                <Typography variant="body1" color="error.main" sx={{ px: 2, py: 1 }}>
                  Error occured while downloading
                </Typography>
              </Button>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Link href={percentage === 100 ? downloadExcelAPI : '#'} underline="none">
                  {(stage === total || stage === 600 || stage === 700) && (
                    <Button variant="outlined" color="info">
                      {/* onClick ==>>  stage === 500 */}
                      <DownloadIcon />
                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          Download Excel file
                        </Typography>
                        {analysisCode === 'PD Progress' && (
                          <Typography variant="caption" color="warning.main">
                            This might take a while
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  )}
                  {stage === 500 && (
                    <Button variant="outlined" color="info">
                      {/* onFinish ==>>  stage === 600 */}
                      <CircularProgress thickness={20} size={30} />
                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          Converting Result to Excel...
                        </Typography>
                        {analysisCode === 'PD Progress' && (
                          <Typography variant="caption" color="warning.main">
                            This might take a while
                          </Typography>
                        )}
                      </Box>
                    </Button>
                  )}
                </Link>
                {analysisCode === 'PD Progress' && (
                  <Link href={stage === total || stage === 600 ? downloadParquetAPI : '#'} underline="none">
                    {(stage === total || stage === 500 || stage === 600) && (
                      <Button variant="contained" color="info">
                        {/* onClick ==>>  stage === 700 */}
                        <DownloadIcon />
                        <Typography variant="h6" sx={{ p: 3 }}>
                          Download Parquet file
                        </Typography>
                      </Button>
                    )}
                    {stage === 700 && (
                      <Button variant="contained" color="info">
                        {/* onFinish ==>>  stage === 1000 */}
                        <CircularProgress thickness={20} size={30} sx={{ color: 'white' }} />
                        <Typography variant="h6" sx={{ p: 3 }}>
                          Converting Result to Parquet file...
                        </Typography>
                      </Button>
                    )}
                  </Link>
                )}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <BorderLinearProgress variant="determinate" color="info" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        {props.status === 'success' ? (
          <Typography variant="body1" color="success.main">{`${Math.round(props.value)}%`}</Typography>
        ) : (
          <Typography variant="h6" color="error.main">
            X
          </Typography>
        )}
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
  status: PropTypes.string,
};
