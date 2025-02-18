import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ linkHome, isIcon, sx }) {
  const logo = (
    <Box
      component="img"
      sx={{ ...sx, height: isIcon ? 36 : 52 }}
      src={`/static/img/logo/eba-${isIcon ? 'icon' : 'logo'}.png`}
    />
  );

  if (!linkHome) {
    return <>{logo}</>;
  }

  return <RouterLink to="/dashboard">{logo}</RouterLink>;
}
