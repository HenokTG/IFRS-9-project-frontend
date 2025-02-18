import { useState, useEffect } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Box, Stack } from '@mui/material';

// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';

// sections
import { AppWidgetSummary, ReportingMonthSelect } from 'sections/@dashboard/AppWidgetSummary';
import { TermLoanECL, OtherFinanicialAssetsECL } from 'sections/@dashboard';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
import { summaryList as orgSummaryList, fetchDashboardSummary } from '_apiAxios/dashboardSummary';

import { ThemeMode } from 'config';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const { loggedIn, profile, approvedResults } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(null);

  const [summaryList, setSummaryList] = useState(orgSummaryList);
  const [summaryDate, setSummaryDate] = useState(approvedResults[0]?.monthLabel);

  useEffect(
    () => {
      if (loggedIn) {
        setLoading(true);
        const summaryFor = approvedResults.find((mnth) => mnth.monthLabel === summaryDate);

        fetchDashboardSummary('/ecl-analysis/api/dashboard-summary', {
          summary_year: summaryFor ? summaryFor.summaryYear : 0,
          summary_month: summaryFor ? summaryFor.summaryMonth : '',
        })
          .then(({ summary }) => {
            setSummaryList(summary);
          })
          .catch(() => {
            setSummaryList(orgSummaryList);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn, summaryDate, refreshTime]
  );

  const isDarkMode = theme.palette.mode === ThemeMode.DARK;

  return (
    <Page title="Dashboard">
      <Container maxWidth={false} disableGutters sx={{ mx: 0, p: 0 }}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, mt: 1 }}>
          <Typography variant="h4">Hi {profile.username}, Welcome back</Typography>
          <Box
            onClick={() => {
              setRefreshTime(new Date());
            }}
            sx={{ cursor: 'pointer', borderRadius: '50%', color: (theme) => theme.palette.primary.light }}
          >
            <Iconify icon="mdi:refresh" width={30} height={30} />
          </Box>
        </Stack>
        <Card sx={{ p: 2, pb: 3, mb: 3, bgcolor: theme.palette.grey[isDarkMode ? 100 : 200] }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
            <Typography variant="h5" color={isDarkMode ? 'white' : 'black'} sx={{ mb: 1 }}>
              ECL Summary
            </Typography>
            <ReportingMonthSelect summaryDate={summaryDate} setSummaryDate={setSummaryDate} isDarkMode={isDarkMode} />
          </Box>

          <Grid container spacing={2}>
            {summaryList.map((sumTotal) => (
              <Grid key={sumTotal.id} item xs={12} sm={6} md={2.4}>
                <AppWidgetSummary sumTotal={sumTotal} loading={loading} />
              </Grid>
            ))}
          </Grid>
        </Card>

        <Grid container spacing={2}>
          <Grid item sm={12} lg={7}>
            <TermLoanECL refresh={refreshTime} sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={5}>
            <OtherFinanicialAssetsECL refresh={refreshTime} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
