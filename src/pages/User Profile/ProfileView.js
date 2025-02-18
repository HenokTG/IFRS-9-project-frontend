// @mui
import { styled } from '@mui/material/styles';
import { Typography, Grid, Stack, Button } from '@mui/material';

// comonents
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

const ProfileElemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

export default function ProfileView({ profile, handlePasswordModalOpen }) {
  return (
    <Stack alignItems={'center'} spacing={3} sx={{ textAlign: 'center', my: 5, width: '100%' }}>
      <h3>Profile Detail</h3>
      <Grid spacing={3} container sx={{ px: { xs: 3, sm: 5 }, maxWidth: 500 }}>
        <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Email:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.email}
          </Typography>
        </ProfileElemStyle>
        <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Phone Number:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.phoneNumber}
          </Typography>
        </ProfileElemStyle>
        <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Department:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.dept}
          </Typography>
        </ProfileElemStyle>
        <ProfileElemStyle sx={{ mb: 5 }}>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Job Title:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.jobTitle}
          </Typography>
        </ProfileElemStyle>
        {/* <ProfileElemStyle>
          <Typography variant="strong" sx={{ color: 'text.primary' }}>
            Is Main User:
          </Typography>
          <Typography variant="p" sx={{ color: 'text.secondary' }}>
            {profile.isMainAdmin}
          </Typography>
        </ProfileElemStyle> */}
      </Grid>
      <Button
        startIcon={<Iconify icon="si:lock-fill" />}
        variant="outlined"
        color="warning"
        onClick={handlePasswordModalOpen}
      >
        Change Password
      </Button>
    </Stack>
  );
}
