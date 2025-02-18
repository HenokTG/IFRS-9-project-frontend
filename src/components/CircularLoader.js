import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({ sectionHeight, size }) {
  return (
    <Box sx={{ display: 'flex', height: sectionHeight, alignItems: 'center' }}>
      <CircularProgress size={size || 40} />
    </Box>
  );
}
