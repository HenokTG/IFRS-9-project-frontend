import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Box } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import { AppWidgetSummary, MonthPicker } from '../sections/@dashboard/AppWidgetSummary';
import { TermLoanECL, OtherFinanicialAssetsECL } from '../sections/@dashboard';

// context and modules
import { fetchDashboardSummary } from '../_apiAxios/dashboardSummary';
import { useGlobalContext } from '../context';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { loggedIn, profilePk, bankName } = useGlobalContext();

  const intialDate = new Date('2021-06-30');

  const [summaryList, setSummaryList] = useState([]);
  const [summaryMonth, setSummaryMonth] = useState(intialDate.toString());

  const navigate = useNavigate();
  const prevLocation = useLocation();

  const changeDatetoLocal = (newValue) => {
    const pickerDate = new Date(newValue);
    setSummaryMonth(pickerDate.toString());
  };

  useEffect(
    () => {
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }

      const summaryAPI = `/ecl-analysis/api/dashboard-summary/${bankName}/${profilePk}/${summaryMonth}`;

      fetchDashboardSummary(profilePk, summaryAPI, setSummaryList);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [summaryMonth]
  );

  return (
    <Page title="Dashboard">
      <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {profilePk}, Welcome back
        </Typography>
        <Card sx={{ p: 2, pb: 3, mb: 3, bgcolor: (theme) => theme.palette.grey[800] }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 5, my: 3 }}>
            <Typography variant="h5" color="white">
              ECL Summary
            </Typography>
            <MonthPicker month={summaryMonth} setMonth={changeDatetoLocal} />
          </Box>

          <Grid container spacing={2}>
            {summaryList.map((sumTotal) => (
              <Grid key={sumTotal.id} item xs={12} sm={6} md={2.4}>
                <AppWidgetSummary sumTotal={sumTotal} />
              </Grid>
            ))}
          </Grid>
        </Card>

        <Grid container spacing={2}>
          <Grid item lg={7}>
            <TermLoanECL />
          </Grid>
          <Grid item lg={5}>
            <OtherFinanicialAssetsECL sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
