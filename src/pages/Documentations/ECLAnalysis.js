import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

// @mui
import { Typography, Box, Container } from '@mui/material';

// components

// context and modules
import { useGlobalContext } from 'contexts/AppContext';
// ----------------------------------------------------------------------

const remarkDetail = [...Array(Math.floor(Math.random() * 7 + 1)).keys()].map((elem) => {
  return {
    detailID: `${elem} - ${uuid()}`,
    detail: faker.lorem.paragraph(Math.floor(Math.random() * 7 + 3)),
  };
});

export default function DocECLAnalysis() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <Container maxWidth={false}>
        <Box>
          <Typography sx={{ m: 2, mb: 4 }} variant="h6">
            ECL Analysis Documentations
          </Typography>
        </Box>

        <Box sx={{ mt: 1, mx: 2 }}>
          {remarkDetail.map((remark) => (
            <Typography key={remark.detailID} variant="body2" align="left" sx={{ mb: 2 }}>
              {remark.detail}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
