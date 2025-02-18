import { useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { Doughnut } from 'react-chartjs-2';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Card, Button, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';

import { fCurrency } from 'utils/formatNumber';
import { useGlobalContext } from 'contexts/AppContext';
import { fetchDashboardOFADataset } from '_apiAxios/dashboardSummary';

import { ThemeMode } from 'config';

import { ReportingMonthSelect, CircularLoader } from './AppWidgetSummary';

const OtherFinanicialAssetsECL = (props) => {
  const theme = useTheme();
  const { loggedIn, approvedResults } = useGlobalContext();

  const isDarkMode = theme.palette.mode === ThemeMode.DARK;

  const [loading, setLoading] = useState(true);

  const [dataSetOFA, setDataSetOFA] = useState([]);
  const [ofaGraphMonth, setOfaGraphMonth] = useState(approvedResults[0]?.monthLabel);

  const data = {
    datasets: [
      {
        data: dataSetOFA.length !== 0 ? dataSetOFA[1] : [0],
        backgroundColor: dataSetOFA.length !== 0 ? dataSetOFA[2] : ['#000'],
        borderWidth: 8,
        borderColor: theme.palette.background.paper,
        hoverBorderColor: theme.palette.background.paper,
      },
    ],
    labels: dataSetOFA.length !== 0 ? dataSetOFA[0] : ['No Data Available for choosen month'],
  };

  const options = {
    animation: true,
    responsive: true,
    layout: { padding: 0 },
    maintainAspectRatio: false,
  };

  const loanTypes = dataSetOFA.length !== 0 ? dataSetOFA[3] : [];

  useEffect(
    () => {
      if (loggedIn) {
        setLoading(true);
        const summaryFor = approvedResults.find((mnth) => mnth.monthLabel === ofaGraphMonth);

        fetchDashboardOFADataset('/ecl-analysis/api/other-assets-summary', {
          summary_year: summaryFor ? summaryFor.summaryYear : 0,
          summary_month: summaryFor ? summaryFor.summaryMonth : '',
        })
          .then(({ otherAssetsDataset }) => {
            setDataSetOFA(otherAssetsDataset);
          })
          .catch(() => {
            setDataSetOFA([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, ofaGraphMonth, props.refresh]
  );

  return (
    <Card {...props}>
      <CardHeader
        title="Other Financial Assets ECL by Loan Types"
        action={
          <ReportingMonthSelect summaryDate={ofaGraphMonth} setSummaryDate={setOfaGraphMonth} isDarkMode={isDarkMode} />
        }
        titleTypographyProps={{ variant: 'h5', mr: 2 }}
        sx={{
          p: 3,
          pl: 2,
          color: isDarkMode ? 'white' : 'black',
          bgcolor: theme.palette.grey[isDarkMode ? 100 : 200],
        }}
      />
      <Divider />
      <CardContent sx={{ px: 0 }}>
        {loading ? (
          <CircularLoader sx={{ py: 10 }} />
        ) : (
          <>
            <Box sx={{ height: 302 }}>
              <Doughnut data={data} options={options} />
            </Box>
            <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', minHeight: 98 }}>
              {loanTypes &&
                loanTypes.map(({ color, title, value }) => (
                  <Box key={title} sx={{ px: 1, py: 0.5, textAlign: 'center' }}>
                    <Typography color="textPrimary" sx={{ fontSize: 10 }}>
                      {title}
                    </Typography>
                    <Typography style={{ color }} sx={{ fontSize: 12 }}>
                      {fCurrency(value)}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </>
        )}
      </CardContent>
      <Divider />
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          color: 'white',
          bgcolor: theme.palette.grey[isDarkMode ? 100 : 200],
        }}
      >
        <RouterLink to="/report/other-financial-assets">
          <Button variant="contained" endIcon={<ArrowRightIcon fontSize="small" />} size="small">
            View All
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

export default OtherFinanicialAssetsECL;
