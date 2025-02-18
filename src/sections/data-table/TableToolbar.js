import moment from 'moment';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

// material
import { alpha, styled } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment, Tooltip, Button } from '@mui/material';

import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

// component
import Iconify from 'components/Iconify';

import useResponsive from 'hooks/useResponsive';

import { TableFilterSidebar } from '.';
import { HidingSelect } from './TableColumnsHidingSelect';

// modules and context

import { isObjectNotEmpty } from '../../utils';

// ----------------------------------------------------------------------

const ContainerStyle = styled('div')(({ theme }) => ({
  margin: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  // padding: theme.spacing(0, 2),
}));

const RootStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  gap: '0.5rem',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const ToolStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  '&.MuiToolbar-root': { padding: 0, minHeight: 0 },
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 400, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.primary.main} !important`,
  },
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  cursor: 'pointer',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(4.5),
  height: theme.spacing(4.5),
  justifyContent: 'center',
}));

const FilterContainerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  alignItems: 'center',
  gap: '0.5rem',
  padding: theme.spacing(0, 3),
}));

const FilterItemStyle = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: '120px',
  '&:hover': {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },
}));
// ----------------------------------------------------------------------

TableToolbar.propTypes = {
  isDocsFilter: PropTypes.bool,
  placeHl: PropTypes.string,
  apiLink: PropTypes.string,
  fetchLink: PropTypes.string,
  filterObject: PropTypes.object,
  filterOptions: PropTypes.object,
  setFilterObject: PropTypes.func,
  setRefreshTime: PropTypes.func,
  setFetchLink: PropTypes.func,
  setPage: PropTypes.func,
  allColumns: PropTypes.array,
  visilbeColumns: PropTypes.array,
  setVisilbeColumns: PropTypes.func,
};

export default function TableToolbar({
  isDocsFilter,
  placeHl,
  apiLink,
  fetchLink,
  filterObject,
  filterOptions,
  setFetchLink,
  setPage,
  setFilterObject,
  setRefreshTime,
  allColumns,
  visilbeColumns,
  setVisilbeColumns,
}) {
  const downSM = useResponsive('down', 'sm');

  const [searchSector, setSearchSector] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);

  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (isDocsFilter && fetchLink.includes('?')) {
      const queryObject = { ...appliedFilters };
      const queryList = fetchLink.split('?').pop().split('&');

      for (let i = 0; i < queryList.length; i += 1) {
        const keyValueList = queryList[i].split('=');
        if (keyValueList[1]) queryObject[keyValueList[0]] = keyValueList[1];
      }

      setAppliedFilters(queryObject);
      setHasAppliedFilter(isObjectNotEmpty(queryObject));
      setSearchSector(queryObject.search_loan_sector || '');
    } else if (placeHl !== 'Full Name') {
      setAppliedFilters(filterObject);
      setHasAppliedFilter(isObjectNotEmpty(filterObject));
      setSearchSector(filterObject.search_loan_sector || '');
    }
  }, [fetchLink, filterObject]);

  const handleRemoveFilter = (filter) => {
    setPage(0);
    if (isDocsFilter) {
      const linkList = fetchLink.split('?');
      const queryList = linkList.pop().split('&');
      const newQueryLink = queryList
        .map((query) => {
          if (query.split('=')[0] === filter) {
            return `${filter}=`;
          }
          return query;
        })
        .join('&');

      setFetchLink(`${linkList[0]}?${newQueryLink}`);
    } else {
      setFilterObject((prev) => {
        const { [filter]: tmp, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleChange = (e) => {
    setSearchSector(e.target.value);
  };

  const searchByLoanSector = (e) => {
    if (e.keyCode === 13) {
      setPage(0);
      setSearchFocused(false);
      setFilterObject((prev) => {
        return { ...prev, search_loan_sector: searchSector };
      });
    }
  };

  return (
    <ContainerStyle>
      <RootStyle>
        {placeHl ? (
          <SearchStyle
            size="small"
            sx={{ pl: 1 }}
            value={searchSector}
            onChange={handleChange}
            onKeyDown={searchByLoanSector}
            placeholder={`Search ${placeHl}...`}
            onBlur={() => setSearchFocused(false)}
            onFocus={() => setSearchFocused(true)}
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        ) : (
          <span />
        )}
        {!(downSM && searchFocused) && (
          <ToolStyle>
            {placeHl !== 'Full Name' && (
              <TableFilterSidebar
                apiLink={apiLink}
                setPage={setPage}
                isDocsFilter={isDocsFilter}
                setFetchLink={setFetchLink}
                filterOptions={filterOptions}
                appliedFilters={appliedFilters}
                setFilterObject={setFilterObject}
              />
            )}

            {placeHl !== 'Full Name' && (
              <HidingSelect
                visilbeColumns={visilbeColumns}
                setVisilbeColumns={setVisilbeColumns}
                allColumns={allColumns}
              />
            )}

            <IconWrapperStyle
              onClick={() => {
                setRefreshTime(new Date());
              }}
              sx={{
                color: (theme) => theme.palette.primary.main,
                backgroundImage: (theme) =>
                  `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(
                    theme.palette.primary.light,
                    0.75
                  )} 100%)`,
              }}
            >
              <Iconify icon="mdi:refresh" width={30} height={30} />
            </IconWrapperStyle>
          </ToolStyle>
        )}
      </RootStyle>
      {hasAppliedFilter && (
        <FilterContainerStyle>
          {Object.entries(appliedFilters).map(([filter, value]) => {
            let title = '';
            if (filter === 'owner' || filter === 'registered_by') {
              title = 'Analyst';
            } else {
              title = filter
                .split('_')
                .map((str) => str[0].toUpperCase() + str.substring(1))
                .join(' ');
            }

            const isDateFilter = filter === 'registered_before' || filter === 'registered_after';

            return value ? (
              <Tooltip title={title} arrow>
                <FilterItemStyle
                  onClick={() => {
                    handleRemoveFilter(filter);
                  }}
                  size="small"
                  variant="outlined"
                  color="info"
                  endIcon={<DoDisturbOnIcon color="error" />}
                >
                  {title}: {isDateFilter ? moment(value, 'YYYY-MM-DD').format('DD-MMM-YYYY') : value}
                </FilterItemStyle>
              </Tooltip>
            ) : null;
          })}
        </FilterContainerStyle>
      )}
    </ContainerStyle>
  );
}
