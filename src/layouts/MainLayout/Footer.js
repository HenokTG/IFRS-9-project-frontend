import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Stack, Typography } from '@mui/material';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      gap={2}
      alignItems="center"
      sx={{ p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">&copy; {year} All rights reserved. TG-A Analaytics</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Link
          component={RouterLink}
          to="/about-and-contact"
          variant="caption"
          color="textPrimary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          About us
        </Link>
        <Link component={RouterLink} to="#" variant="caption" color="textPrimary">
          Privacy
        </Link>
        <Link component={RouterLink} to="#" variant="caption" color="textPrimary">
          Terms
        </Link>
      </Stack>
    </Stack>
  );
};

export default Footer;
