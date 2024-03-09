import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material
import {
  Container,
  Card,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import TermLoanListHead from '../../sections/annualReport/AnnualReportListHead';
import ListToolbar from '../../sections/ListToolbar';
import ReportLoading from './helper-modules/reportLoading';

// locals
import { useGlobalContext } from '../../context';
import { fCurrency } from '../../utils/formatNumber';
import fetchTermLoans from '../../_apiAxios/annual-reports';
import { applySortFilter, getComparator } from './helper-modules/sortFilterReport';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'reportingMonth', label: 'Reporting Month', alignRight: false },
  { id: 'loanSector', label: 'Loan Sector', alignRight: false },
  { id: 'stage1', label: 'Stage 1 ECL', alignRight: false },
  { id: 'stage2', label: 'Stage 2 ECL', alignRight: false },
  { id: 'stage3', label: 'Stage 3 ECL', alignRight: false },
  { id: 'registeredBy', label: 'Registered By', alignRight: false },
  { id: 'registeredOn', label: 'Registered On', alignRight: false },
];

const BoxedTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    borderRightWidth: '1px',
  },
}));

export default function TermLoanReport() {
  const { loggedIn, bankName } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [TERMLOANLIST, setTERMLOANLIST] = useState([]);
  const [fetchLink, setFetchLink] = useState(`/ecl-analysis/api/report-term-loan-ecl/${bankName}`);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      setLoading(true);
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
      fetchTermLoans(setLoading, setTERMLOANLIST, fetchLink, 'TL');
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchLink]
  );

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('registeredOn');

  const [filterTermLoanID, setFilterTermLoanID] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTermLoanLoanSector = (event) => {
    setFilterTermLoanID(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - TERMLOANLIST.length) : 0;

  const filteredTermLoans = applySortFilter(TERMLOANLIST, getComparator(order, orderBy), filterTermLoanID);

  const isTermLoanNotFound = filteredTermLoans.length === 0;

  return (
    <Page title="Annual Report: Term Loan">
      <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Term Loan ECL
          </Typography>
        </Stack>
        {loading ? (
          <ReportLoading />
        ) : (
          <Card>
            <ListToolbar
              filterName={filterTermLoanID}
              onFilterName={handleFilterByTermLoanLoanSector}
              placeHl="Term Loan ECL by Loan Sector"
              reportList={TERMLOANLIST}
              reportID={{ api: 'ecl-analysis', link: 'report-term-loan-ecl', institute: bankName }}
              setFetchLink={setFetchLink}
            />
            <Scrollbar>
              <Card sx={{ mx: 2, borderRadius: 1 }}>
                <Table size='small'>
                  <TermLoanListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredTermLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        reportingMonth,
                        reportingYear,
                        loanSector,
                        stage1,
                        stage2,
                        stage3,
                        registeredBy,
                        registeredOn,
                      } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <BoxedTableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {reportingMonth} - {reportingYear}
                              </Typography>
                            </Stack>
                          </BoxedTableCell>
                          <BoxedTableCell align="left">{loanSector}</BoxedTableCell>
                          <BoxedTableCell align="right">{fCurrency(stage1)}</BoxedTableCell>
                          <BoxedTableCell align="right">{fCurrency(stage2)}</BoxedTableCell>
                          <BoxedTableCell align="right">{fCurrency(stage3)}</BoxedTableCell>
                          <BoxedTableCell align="center">{registeredBy}</BoxedTableCell>
                          <TableCell align="right">{registeredOn}</TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isTermLoanNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterTermLoanID} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </Card>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={TERMLOANLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}
