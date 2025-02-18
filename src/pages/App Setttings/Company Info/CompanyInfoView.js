// @mui
import { styled } from '@mui/material/styles';
import { Typography, Grid, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const CompanyInfoElemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

export default function CompanyInfoView({ companyInfo }) {
  return (
    <Stack alignItems={'center'} spacing={3} sx={{ textAlign: 'center', marginTop: 5, width: '100%' }}>
      <h3>Company Detail</h3>
      <Grid spacing={3} container gridTemplateColumns={'1fr 1fr'} sx={{ px: { xs: 3, sm: 5 }, maxWidth: 500 }}>
        <CompanyInfoElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Name:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {companyInfo.name}
          </Typography>
        </CompanyInfoElemStyle>
        <CompanyInfoElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Email:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {companyInfo.email}
          </Typography>
        </CompanyInfoElemStyle>
        <CompanyInfoElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Phone Number:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {companyInfo.phoneNumber}
          </Typography>
        </CompanyInfoElemStyle>
        <CompanyInfoElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Joined:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {companyInfo.createdAt}
          </Typography>
        </CompanyInfoElemStyle>
        <CompanyInfoElemStyle sx={{ mb: 5 }}>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Latest Data:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {companyInfo.latestData}
          </Typography>
        </CompanyInfoElemStyle>
      </Grid>
    </Stack>
  );
}
