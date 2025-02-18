import React from 'react';
import { CardHeader } from '@mui/material';

import useResponsive from 'hooks/useResponsive';

function AnalysisCardHeader({ title }) {
  const downSM = useResponsive('down', 'sm');

  return (
    <CardHeader
      title={title}
      subheader="Fill all Required (*) Fields"
      sx={{ backgroundColor: 'grey.200', padding: 1, borderRadius: 1 }}
      titleTypographyProps={{
        color: 'success.dark',
        variant: downSM ? 'h4' : 'h3',
        lineHeight: 1.75,
        align: 'center',
      }}
      subheaderTypographyProps={{
        color: 'warning.main',
        variant: downSM ? 'subtitle2' : 'subtitle1',
        align: 'center',
      }}
    />
  );
}

export default AnalysisCardHeader;
