// @mui
import { styled } from '@mui/material/styles';
import { Card, Box, Container, Typography } from '@mui/material';

// hooks
import useResponsive from 'hooks/useResponsive';

// components
import Page from 'components/Page';

// sections
import { PasswordResetRequestForm } from 'sections/auth/password-reset';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
  paddingTop: 125,
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
            <Box component="img" src="/static/img/logo/eba-logo.png" sx={{ width: 350, height: 80 }} />
            <Typography
              color="goldenrod"
              sx={{ fontFamily: 'Lucida Handwriting', textAlign: 'center', fontSize: 30, py: 2, fontWeight: 'bold' }}
            >
              IFRS-9 Analyzer
            </Typography>
          </Box>
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Please submit your email to reset your password
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your Email below.</Typography>

            <PasswordResetRequestForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
