import { useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { Doughnut } from 'react-chartjs-2';
import { Box, Card, Button, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { MonthPicker } from './AppWidgetSummary';
import { useGlobalContext } from '../../context';
import { fetchDashboardOFADataset } from '../../_apiAxios/dashboardSummary';

const OtherFinanicialAssetsECL = (props) => {
  const theme = useTheme();

  const { profilePk, bankName } = useGlobalContext();

  const intialOFADate = new Date('2021-06-30');

  const [dataSetOFA, setDataSetOFA] = useState([]);
  const [ofaGraphMonth, setOfaGraphMonth] = useState(intialOFADate.toString());

  const data = {
    datasets: [
      {
        data: dataSetOFA.length !== 0 ? dataSetOFA[1] : [0],
        backgroundColor: dataSetOFA.length !== 0 ? dataSetOFA[2] : ['#000'],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF',
      },
    ],
    labels: dataSetOFA.length !== 0 ? dataSetOFA[0] : ['No Data Available for choosen month'],
  };

  const options = {
    animation: true,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
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

  const loanTypes = dataSetOFA.length !== 0 ? dataSetOFA[3] : [];

  useEffect(
    () => {
      const OFAAPI = `/ecl-analysis/api/ofa-summary/${bankName}/${profilePk}/${ofaGraphMonth}`;

      fetchDashboardOFADataset(profilePk, OFAAPI, setDataSetOFA);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ofaGraphMonth]
  );

  const changeDatetoLocal = (newValue) => {
    const pickerDate = new Date(newValue);
    setOfaGraphMonth(pickerDate.toString());
  };

  return (
    <Card {...props}>
      <CardHeader
        title="Other Financial Assets ECL by Loan Types"
        action={<MonthPicker month={ofaGraphMonth} setMonth={changeDatetoLocal} sx={{ width: '70%', ml: '30%' }} />}
        sx={{
          p: 3,
          pb: 2,
          color: 'white',
          bgcolor: (theme) => theme.palette.grey[800],
        }}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 302,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Doughnut data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            pt: 2,
            minHeight: 98,
          }}
        >
          {loanTypes &&
            loanTypes.map(({ color, title, value }) => (
              <Box
                key={title}
                sx={{
                  px: 1,
                  py: 0.5,
                  textAlign: 'center',
                }}
              >
                <Typography color="textPrimary" sx={{ fontSize: 10 }}>
                  {title}
                </Typography>
                <Typography style={{ color }} sx={{ fontSize: 12 }}>
                  {value}%
                </Typography>
              </Box>
            ))}
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
        <RouterLink to="/app/report/other-financial-assets-result-summary" >
          <Button color="info" variant="contained" endIcon={<ArrowRightIcon fontSize="small" />} size="small">
            View All
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

export default OtherFinanicialAssetsECL;
