import PropTypes from 'prop-types';

// material
import { Box, TableRow, TableCell, TableHead, TableSortLabel, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

// ---------------------------------------------------------------------

const StyledTableSortLable = styled(TableSortLabel)(({ theme }) => ({
  root: {
    color: 'white',
    '&:hover': {
      color: 'white',
    },
    '&$active': {
      color: 'white',
    },
  },
  active: {},
  icon: {
    color: 'inherit !important',
  },
}));

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

AnnualReportListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func,
};

export default function AnnualReportListHead({ order, orderBy, headLabel, onRequestSort }) {
  const createSortHandler = (headCell) => (event) => {
    if (headCell.sortKey) onRequestSort(event, headCell);
  };

  return (
    <TableHead sx={{ bgcolor: 'primary.light' }}>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align="center" sortDirection={orderBy === headCell.id ? order : false}>
            <StyledTableSortLable
              hideSortIcon
              sx={{ cursor: headCell.sortKey ? 'pointer' : 'auto' }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </StyledTableSortLable>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
