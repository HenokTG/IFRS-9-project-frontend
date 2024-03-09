import { useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

// react chart
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Chart } from 'react-chartjs-2';
// MUI
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { MonthPicker } from './AppWidgetSummary';
import { useGlobalContext } from '../../context';
import { fetchDashboardTLDataset } from '../../_apiAxios/dashboardSummary';

const TermLoanECL = (props) => {
  const theme = useTheme();

  const { profilePk, bankName } = useGlobalContext();

  const intialTLDate = new Date('2021-06-30');

  const [dataSetTL, setDataSetTL] = useState([]);
  const [tlGraphMonth, setTlGraphMonth] = useState(intialTLDate.toString());

  const data = {
    datasets: [
      {
        backgroundColor: '#18A558',
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 3,
        categoryPercentage: 0.5,
        data: dataSetTL.length !== 0 ? dataSetTL[0] : [],
        label: 'Stage 1',
        maxBarThickness: 24,
      },
      {
        backgroundColor: '#2E8BC0',
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 3,
        categoryPercentage: 0.5,
        data: dataSetTL.length !== 0 ? dataSetTL[1] : [],
        label: 'Stage 2',
        maxBarThickness: 24,
      },
      {
        backgroundColor: '#FF4500',
        barPercentage: 0.5,
        barThickness: 30,
        borderRadius: 3,
        categoryPercentage: 0.5,
        data: dataSetTL.length !== 0 ? dataSetTL[2] : [],
        label: 'Stage 3',
        maxBarThickness: 24,
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
      const TLAPI = `/ecl-analysis/api/tl-summary/${bankName}/${profilePk}/${tlGraphMonth}`;

      fetchDashboardTLDataset(profilePk, TLAPI, setDataSetTL);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tlGraphMonth]
  );

  const changeDatetoLocal = (newValue) => {
    const pickerDate = new Date(newValue);
    setTlGraphMonth(pickerDate.toString());
  };

  return (
    <Card {...props}>
      <CardHeader
        title="Term Loan ECL by Loan Sectors"
        action={<MonthPicker month={tlGraphMonth} setMonth={changeDatetoLocal} />}
        sx={{ p: 3, color: 'white', bgcolor: (theme) => theme.palette.grey[800] }}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative',
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2,
          color: 'white',
          bgcolor: (theme) => theme.palette.grey[800],
        }}
      >
        <RouterLink to="/app/report/term-loan-result-summary" >
          <Button color="info" variant="contained" endIcon={<ArrowRightIcon fontSize="small" />} size="small">
            View All
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

export default TermLoanECL;
