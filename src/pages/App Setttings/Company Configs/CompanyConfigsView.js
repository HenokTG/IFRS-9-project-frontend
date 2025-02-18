// @mui
import { styled } from '@mui/material/styles';
import { Typography, Grid, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const CompanyConfigsElemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: theme.spacing(0.5, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

export default function CompanyConfigsView({ profile }) {
  return (
    <Stack alignItems={'center'} spacing={3} sx={{ textAlign: 'center', marginTop: 5, width: '100%' }}>
      <h3>CompanyConfigs Detail</h3>
      <Grid spacing={3} container gridTemplateColumns={'1fr 1fr'} sx={{ px: 5, width: 500 }}>
        <CompanyConfigsElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Email:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.email}
          </Typography>
        </CompanyConfigsElemStyle>
        <CompanyConfigsElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Phone Number:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.phoneNumber}
          </Typography>
        </CompanyConfigsElemStyle>
        <CompanyConfigsElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Department:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.dept}
          </Typography>
        </CompanyConfigsElemStyle>
        <CompanyConfigsElemStyle sx={{ mb: 5 }}>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Job Title:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.jobTitle}
          </Typography>
        </CompanyConfigsElemStyle>
      </Grid>
    </Stack>
  );
}
