import * as React from 'react';
import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Button, Typography, CircularProgress } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/Download';
import DangerousIcon from '@mui/icons-material/Dangerous';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
import { downloadResult } from 'utils/axios';

const BorderLinearProgress = styled(LinearProgress)(({ theme, status }) => ({
  height: 8,
  borderRadius: 4,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: status === 'success' ? theme.palette.success.main : theme.palette.error.main,
  },
}));

AnalysisProgressTracker.propTypes = {
  currentState: PropTypes.object,
  downloadExcelAPI: PropTypes.string,
  downloadParquetAPI: PropTypes.string,
};

export default function AnalysisProgressTracker({
  currentState,
  downloadExcelAPI,
  downloadParquetAPI,
  setShowProgress,
}) {
  const { analysisProgress } = useGlobalContext();

  const { analysisCode, stage, status, title, total } = currentState;
  const percentage = (stage * 100) / total;

  const showExcelDownloadBtn = stage === total || stage === 600 || stage === 700;
  const showExcelDownloadingBtn = stage === 500 || stage === 550 || stage === 575;
  const showParquetDownloadBtn = showExcelDownloadingBtn || stage === total || stage === 600;
  const showParquetDownloadingBtn = stage === 700;

  return (
    <Box sx={{ width: '100%' }}>
      {stage < total ? (
        <Stack alignItems={'start'}>
          {status !== 'success' && (
            <Button
              fullWidth
              sx={{
                bgcolor: 'secondary.light',
                px: 4,
                display: 'flex',
                justifyContent: 'space-between',
                items: 'center',
              }}
            >
              <BugReportIcon color="error" />
              <Typography variant="h6" sx={{ py: 1 }} color="error.main">
                Error occured during computations
              </Typography>

              <Button
                color="error"
                variant="outlined"
                size="small"
                sx={{ height: '1.5rem', cursor: 'pointer' }}
                onClick={() => setShowProgress(false)}
              >
                Close
              </Button>
            </Button>
          )}
          <Typography
            fontSize={12}
            variant="body2"
            color={status === 'success' ? 'text.success' : 'warning.main'}
            align="left"
            sx={{ my: 1, px: 1 }}
          >
            {title}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={percentage} status={status} />
          </Box>
          {analysisProgress.map((progress) => (
            <Typography
              color={status === 'success' ? 'text.secondary' : 'warning.main'}
              key={progress.title}
              variant="body2"
              fontSize={10}
              px={1}
            >
              {progress.isTaskCompleted ? '' : progress.title}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Box sx={{ width: '100%' }}>
          {status !== 'success' ? (
            <Button variant="contained" disabled>
              <DangerousIcon color="error" />
              <Typography variant="body1" color="error.main" sx={{ px: 2, py: 1 }}>
                Error occured while downloading
              </Typography>
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
              <>
                {showExcelDownloadBtn && (
                  <Button
                    onClick={() => {
                      if (percentage === 100) downloadResult(downloadExcelAPI);
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    {/* onClick ==>>  stage === 500 */}
                    <DownloadIcon />
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h6" color="primary.main">
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
                {showExcelDownloadingBtn && (
                  <Button variant="outlined" color="primary">
                    {/* onFinish ==>>  stage === 600 */}
                    <CircularProgress thickness={20} size={30} />
                    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h6" color="primary.main">
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
              </>
              {analysisCode === 'PD Progress' && (
                <>
                  {showParquetDownloadBtn && (
                    <Button
                      onClick={() => {
                        if (stage === total || stage === 600) downloadResult(downloadParquetAPI);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {/* onClick ==>>  stage === 700 */}
                      <DownloadIcon />
                      <Typography variant="h6" sx={{ p: 3 }}>
                        Download Parquet file
                      </Typography>
                    </Button>
                  )}
                  {showParquetDownloadingBtn && (
                    <Button variant="contained" color="primary">
                      {/* onFinish ==>>  stage === 1000 */}
                      <CircularProgress thickness={20} size={30} sx={{ color: 'white' }} />
                      <Typography variant="h6" sx={{ p: 3 }}>
                        Converting Result to Parquet file...
                      </Typography>
                    </Button>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <BorderLinearProgress variant="determinate" color="primary" {...props} />
      </Box>
      <Box>
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
  value: PropTypes.number.isRequired,
  status: PropTypes.string,
};
