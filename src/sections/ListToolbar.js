import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, OutlinedInput, InputAdornment } from '@mui/material';
// component
import Iconify from '../components/Iconify';
import { AnnualReportFilterSidebar } from './annualReport';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  margin: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 400,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.info.main} !important`,
  },
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  numSelected: PropTypes.number,
  placeHl: PropTypes.string,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  reportID: PropTypes.object,
  reportList: PropTypes.array,
  setFetchLink: PropTypes.func,
};

export default function ListToolbar({
  numSelected,
  placeHl,
  filterName,
  onFilterName,
  reportList,
  reportID,
  setFetchLink,
}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <SearchStyle
        value={filterName}
        onChange={onFilterName}
        placeholder={`Search ${placeHl}...`}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />

      {placeHl !== 'Full Name' && (
        <AnnualReportFilterSidebar reportList={reportList} reportID={reportID} setFetchLink={setFetchLink} />
      )}
    </RootStyle>
  );
}
