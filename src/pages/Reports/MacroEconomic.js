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
import CardPurchaseListHead from '../../sections/annualReport/AnnualReportListHead';
import ListToolbar from '../../sections/ListToolbar';
import ReportLoading from './helper-modules/reportLoading';

// locals
import { useGlobalContext } from '../../context';
import { fPercent } from '../../utils/formatNumber';
import fetchMacroCCF from '../../_apiAxios/annual-reports';
import { applySortFilter, getComparator } from './helper-modules/sortFilterReport';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'reportingMonth', label: 'Reporting Month', alignRight: false },
  { id: 'loanSector', label: 'Loan Sector', alignRight: false },
  { id: 'mepe1', label: 'Year 1', alignRight: false },
  { id: 'mepe2', label: 'Year 2', alignRight: false },
  { id: 'mepe3', label: 'Year 3', alignRight: false },
  { id: 'ccf', label: 'CCF', alignRight: false },
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

export default function FLIandCCFData() {
  const { loggedIn, bankName } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [MACROCCFLIST, setMACROCCFLIST] = useState([]);
  const [fetchLink, setFetchLink] = useState(`/macro-ccf-analysis/api/report-macro/${bankName}`);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      setLoading(true);
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
      fetchMacroCCF(setLoading, setMACROCCFLIST, fetchLink, 'Macro_CCF');
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchLink]
  );

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('registeredOn');

  const [filterMacroID, setFilterMacroID] = useState('');

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

  const handleFilterByMacroID = (event) => {
    setFilterMacroID(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - MACROCCFLIST.length) : 0;

  const filteredMacroCCF = applySortFilter(MACROCCFLIST, getComparator(order, orderBy), filterMacroID);

  const isMacroCCFNotFound = filteredMacroCCF.length === 0;

  return (
    <Page title="Annual Report: Macro Economic Prejection and CCF">
      <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Macro Economic Prejection and CCF
          </Typography>
        </Stack>
        {loading ? (
          <ReportLoading />
        ) : (
          <Card>
            <ListToolbar
              filterName={filterMacroID}
              onFilterName={handleFilterByMacroID}
              placeHl="Macro Eco. proj. & CCF by Loan Sector"
              reportList={MACROCCFLIST}
              reportID={{ api: 'macro-ccf-analysis', link: 'report-macro', institute: bankName }}
              setFetchLink={setFetchLink}
            />
            <Scrollbar>
              <Card sx={{ mx: 2, borderRadius: 1 }}>
                <Table size='small'>
                  <CardPurchaseListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredMacroCCF.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        reportingMonth,
                        reportingYear,
                        loanSector,
                        mepe1,
                        mepe2,
                        mepe3,
                        ccf,
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
                          <BoxedTableCell align="right">{mepe1.toFixed(6)}</BoxedTableCell>
                          <BoxedTableCell align="right">{mepe2.toFixed(6)}</BoxedTableCell>
                          <BoxedTableCell align="right">{mepe3.toFixed(6)}</BoxedTableCell>
                          <BoxedTableCell align={ccf === 0 ? 'center' : 'right'}>
                            {ccf === 0 ? '-' : fPercent(ccf)}
                          </BoxedTableCell>
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

                  {isMacroCCFNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterMacroID} />
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
              count={MACROCCFLIST.length}
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
