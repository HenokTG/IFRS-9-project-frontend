import { useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

// react chart
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
// MUI
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';

import { useGlobalContext } from 'contexts/AppContext';
import { fetchDashboardTLDataset } from '_apiAxios/dashboardSummary';

import { ThemeMode } from 'config';

import { ReportingMonthSelect, CircularLoader } from './AppWidgetSummary';

const TermLoanECL = (props) => {
  const theme = useTheme();
  const { loggedIn, approvedResults } = useGlobalContext();

  const isDarkMode = theme.palette.mode === ThemeMode.DARK;

  const [loading, setLoading] = useState(true);

  const [dataSetTL, setDataSetTL] = useState([]);
  const [tlGraphMonth, setTlGraphMonth] = useState(approvedResults[0]?.monthLabel);

  const data = {
    datasets: [
      {
        backgroundColor: '#18A558',
        borderRadius: 2,
        data: dataSetTL.length !== 0 ? dataSetTL[0] : [],
        label: 'Stage 1',
      },
      {
        backgroundColor: '#2E8BC0',
        borderRadius: 2,
        data: dataSetTL.length !== 0 ? dataSetTL[1] : [],
        label: 'Stage 2',
      },
      {
        backgroundColor: '#FF4500',
        borderRadius: 2,
        data: dataSetTL.length !== 0 ? dataSetTL[2] : [],
        label: 'Stage 3',
      },
    ],
    labels: dataSetTL.length !== 0 ? dataSetTL[3] : [],
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0,
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider,
        },
      },
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary,
    },
  };

  useEffect(
    () => {
      if (loggedIn) {
        setLoading(true);
        const summaryFor = approvedResults.find((mnth) => mnth.monthLabel === tlGraphMonth);

        fetchDashboardTLDataset('/ecl-analysis/api/term-loan-summary', {
          summary_year: summaryFor ? summaryFor.summaryYear : 0,
          summary_month: summaryFor ? summaryFor.summaryMonth : '',
        })
          .then(({ termLoanDataset }) => {
            setDataSetTL(termLoanDataset);
          })
          .catch(() => {
            setDataSetTL([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, tlGraphMonth, props.refresh]
  );

  return (
    <Card {...props}>
      <CardHeader
        title="Term Loan ECL by Loan Sectors"
        action={
          <ReportingMonthSelect summaryDate={tlGraphMonth} setSummaryDate={setTlGraphMonth} isDarkMode={isDarkMode} />
        }
        titleTypographyProps={{ variant: 'h5' }}
        sx={{
          p: 3,
          pl: 2,
          color: isDarkMode ? 'white' : 'black',
          bgcolor: theme.palette.grey[isDarkMode ? 100 : 200],
        }}
      />
      <Divider />
      <CardContent sx={{ px: 1 }}>
        {loading ? (
          <CircularLoader sx={{ py: 10 }} />
        ) : (
          <>
            <Box sx={{ height: 465 }}>
              <Bar data={data} options={options} />
            </Box>
          </>
        )}
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          color: 'white',
          bgcolor: (theme) => theme.palette.grey[isDarkMode ? 100 : 200],
        }}
      >
        <RouterLink to="/report/term-loan">
          <Button variant="contained" endIcon={<ArrowRightIcon fontSize="small" />} size="small">
            View All
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

export default TermLoanECL;
