import PropTypes from 'prop-types';
import { useState } from 'react';

// material
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  MenuItem,
  TextField,
  FormControl,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { DatePicker } from '../../components/hook-form';

// ----------------------------------------------------------------------

export const FILTER_PACKAGE_OPTIONS = ['100 Birr', '200 Birr', '500 Birr', '1000 Birr'];
export const FILTER_AGENT_OPTIONS = ['Agent 1', 'Agent 2', 'Agent 3', 'Agent 4'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below 220 Birr' },
  { value: 'between', label: 'Between 220 - 750 Birr' },
  { value: 'above', label: 'Above 75 Birr' },
];

// ----------------------------------------------------------------------

AnnualReportFilterSidebar.propTypes = {
  reportID: PropTypes.object,
  reportList: PropTypes.array,
  setFetchLink: PropTypes.func,
};

export default function AnnualReportFilterSidebar({ reportList, reportID, setFetchLink }) {
  const [openFilter, setOpenFilter] = useState(false);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [reportingMonth, setReportingMonth] = useState('');
  const [reportingYear, setReportingYear] = useState('');
  const [loanSector, setLoanSector] = useState('');
  const [registeredBy, setRegisteredBy] = useState('');
  const [reportedBefore, setReportedBefore] = useState(null);
  const [reportedAfter, setReportedAfter] = useState(null);

  const filterProps = [
    {
      title: 'Reporting Month',
      child: [...new Set(reportList.map((pay) => pay.reportingMonth))],
      valueSet: reportingMonth,
      callChangeFunc: setReportingMonth,
    },
    {
      title: 'Reporting Year',
      child: [...new Set(reportList.map((pay) => pay.reportingYear))],
      valueSet: reportingYear,
      callChangeFunc: setReportingYear,
    },
    {
      title: 'Loan Sector',
      child: [...new Set(reportList.map((pay) => pay.loanSector))],
      valueSet: loanSector,
      callChangeFunc: setLoanSector,
    },
    {
      title: 'Registered By',
      child: [...new Set(reportList.map((pay) => pay.registeredBy))],
      valueSet: registeredBy,
      callChangeFunc: setRegisteredBy,
    },
    {
      fieldName: 'reportingDateBefore',
      title: 'Registered Before',
      child: null,
      valueSet: reportedBefore,
      callChangeFunc: setReportedBefore,
    },
    {
      fieldName: 'reportingDateAfter',
      title: 'Registered After',
      child: null,
      valueSet: reportedAfter,
      callChangeFunc: setReportedAfter,
    },
  ];

  const handleBackendFilter = () => {
    const reportBackendURL = `/${reportID.api}/api/${reportID.link}/${
      reportID.institute
    }?Loan_Sector=${loanSector}&Registered_By=${registeredBy}&Reporting_Month=${
      reportingMonth}&Reporting_Year=${reportingYear}&Registered_Before=${
      reportedBefore ? reportedBefore.toISOString().split('T')[0] : ''
    }&Registered_After=${reportedAfter ? reportedAfter.toISOString().split('T')[0] : ''}`;

    setFetchLink(reportBackendURL);
  };

  const clearBackendFilter = () => {
    setReportingMonth('');
    setLoanSector('');
    setRegisteredBy('');
    const reportBackendURL = `/${reportID.api}/api/${reportID.link}/${reportID.institute}`;
    setFetchLink(reportBackendURL);
    handleCloseFilter();
  };

  return (
    <>
      <Button
        disableRipple
        color="info"
        size="large"
        variant="outlined"
        sx={{ width: '10rem' }}
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={handleOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={handleCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={handleCloseFilter}>
            <Iconify icon="eva:close-fill" width={20} height={20} sx={{ color: 'error.main' }} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={2} sx={{ p: 3 }}>
            {filterProps &&
              filterProps.map((catg, idx) =>
                catg.child ? (
                  <FormControl fullWidth key={`${idx} - ${catg.title}`}>
                    <TextField
                      select
                      size="small"
                      name="selectAgent"
                      label={catg.title}
                      value={catg.valueSet}
                      onChange={(elem) => catg.callChangeFunc(elem.target.value)}
                    >
                      {catg.child.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                ) : (
                  <DatePicker
                    key={`${idx} - ${catg.title}`}
                    picekerName={catg.fieldName}
                    pickerLabel={catg.title}
                    sx={{ ml: 10 }}
                    date={catg.valueSet}
                    setDate={catg.callChangeFunc}
                  />
                )
              )}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="success"
            variant="outlined"
            startIcon={<Iconify icon="codicon:github-action" />}
            sx={{ mb: 1 }}
            onClick={() => handleBackendFilter()}
          >
            Apply Filter
          </Button>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="warning"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={() => clearBackendFilter()}
          >
            Clear Filter
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
