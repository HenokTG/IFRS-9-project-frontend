import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

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
import { useTheme } from '@mui/material/styles';

// components
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import { DatePicker } from 'components/hook-form';

import useResponsive from 'hooks/useResponsive';

// ----------------------------------------------------------------------

TableFilterSidebar.propTypes = {
  apiLink: PropTypes.string,
  filterOptions: PropTypes.object,
  appliedFilters: PropTypes.object,
  setFilterObject: PropTypes.func,
  setFetchLink: PropTypes.func,
  setPage: PropTypes.func,
  isDocsFilter: PropTypes.bool,
};

export default function TableFilterSidebar({
  apiLink,
  filterOptions,
  appliedFilters,
  setPage,
  setFilterObject,
  setFetchLink,
  isDocsFilter,
}) {
  const theme = useTheme();

  const downSM = useResponsive('down', 'sm');

  const [openFilter, setOpenFilter] = useState(false);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [reportingMonth, setReportingMonth] = useState(appliedFilters.reporting_month);
  const [reportingYear, setReportingYear] = useState(appliedFilters.reporting_year);
  const [loanSector, setLoanSector] = useState(appliedFilters.loan_sector);
  const [search4Analyser, setSearch4Analyser] = useState(appliedFilters.owner);
  const [reportedBefore, setReportedBefore] = useState(appliedFilters.registered_before);
  const [reportedAfter, setReportedAfter] = useState(appliedFilters.registered_after);

  useEffect(() => {
    setReportingMonth(appliedFilters.reporting_month);
    setReportingYear(appliedFilters.reporting_year);
    setLoanSector(appliedFilters.loan_sector);
    setSearch4Analyser(appliedFilters.owner);
    setReportedBefore(appliedFilters.registered_before);
    setReportedAfter(appliedFilters.registered_after);
  }, [appliedFilters]);

  const hasLoanType = apiLink === '/ecl-analysis/api/report-other-financial-assets-ecl/';

  const filterProps = [
    {
      title: 'Reporting month',
      child: filterOptions.reporting_month || [],
      valueSet: reportingMonth,
      callChangeFunc: setReportingMonth,
    },
    {
      title: 'Reporting year',
      child: filterOptions.reporting_year || [],
      valueSet: reportingYear,
      callChangeFunc: setReportingYear,
    },
    {
      title: `Loan ${hasLoanType ? 'type' : 'sector'}`,
      child: filterOptions.loan_sector || [],
      valueSet: loanSector,
      hidden: isDocsFilter,
      callChangeFunc: setLoanSector,
    },

    {
      title: 'Analyst',
      valueSet: search4Analyser,
      callChangeFunc: setSearch4Analyser,
    },
    {
      fieldName: 'reportingDateBefore',
      title: 'Analysis date before',
      child: null,
      valueSet: reportedBefore,
      isDatePickerField: true,
      callChangeFunc: setReportedBefore,
    },
    {
      fieldName: 'reportingDateAfter',
      title: 'Analysis date after',
      child: null,
      valueSet: reportedAfter,
      isDatePickerField: true,
      callChangeFunc: setReportedAfter,
    },
  ];

  const handleBackendFilter = () => {
    setPage(0);

    if (isDocsFilter) {
      const docsFetchURL = `${apiLink}?owner=${search4Analyser || ''}&reporting_month=${
        reportingMonth || ''
      }&reporting_year=${reportingYear || ''}&registered_before=${reportedBefore || ''}&registered_after=${
        reportedAfter || ''
      }`;

      setFetchLink(docsFetchURL);
    } else {
      const filter = { ...appliedFilters };

      if (loanSector) filter.loan_sector = loanSector;
      if (search4Analyser) filter.owner = search4Analyser;
      if (reportingMonth) filter.reporting_month = reportingMonth;
      if (reportingYear) filter.reporting_year = reportingYear;
      if (reportedBefore) filter.registered_before = reportedBefore;
      if (reportedAfter) filter.registered_after = reportedAfter;

      setFilterObject(filter);
    }
  };

  const clearBackendFilter = () => {
    setPage(0);

    setLoanSector('');
    setReportingMonth('');
    setSearch4Analyser('');
    setReportedBefore(null);
    setReportedAfter(null);
    handleCloseFilter();

    if (isDocsFilter) {
      setFetchLink(apiLink);
    } else {
      setFilterObject({});
    }
  };

  return (
    <>
      {downSM ? (
        <IconButton
          sx={{ p: 0.25, border: `1.5px solid ${theme.palette.primary.main}`, borderRadius: 1 }}
          onClick={handleOpenFilter}
        >
          <Iconify icon="ic:round-filter-list" width={30} height={30} sx={{ color: 'primary.main' }} />
        </IconButton>
      ) : (
        <Button
          sx={{ height: 36 }}
          disableRipple
          variant="outlined"
          endIcon={<Iconify icon="ic:round-filter-list" />}
          onClick={handleOpenFilter}
        >
          Filters&nbsp;
        </Button>
      )}

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
              filterProps
                .filter((query) => !query.hidden)
                .map((catg, idx) => (
                  <Stack key={`${idx} - ${catg.title}`}>
                    {catg.child ? (
                      <FormControl fullWidth>
                        <TextField
                          select
                          size="small"
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
                      <>
                        {catg.isDatePickerField ? (
                          <DatePicker
                            fullWidth
                            picekerName={catg.fieldName}
                            pickerLabel={catg.title}
                            isMonthPicker={false}
                            date={catg.valueSet}
                            setDate={catg.callChangeFunc}
                          />
                        ) : (
                          <TextField
                            size="small"
                            label={catg.title}
                            value={catg.valueSet}
                            onChange={(elem) => catg.callChangeFunc(elem.target.value)}
                          />
                        )}
                      </>
                    )}
                  </Stack>
                ))}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
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
            type="submit"
            color="error"
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
