import PropTypes from 'prop-types';
// material
import { Box, TableRow, TableCell, TableHead, TableSortLabel, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const BoxedTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.common.white,
    borderRightWidth: '1px',
    color: theme.palette.common.white,
  },
}));

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
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ bgcolor: 'error.dark' }}>
      <TableRow>
        {headLabel.map((headCell) => (
          <BoxedTableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'center'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <StyledTableSortLable
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </StyledTableSortLable>
          </BoxedTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
