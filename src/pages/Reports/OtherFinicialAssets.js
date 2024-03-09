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
import OtherAssetListHead from '../../sections/annualReport/AnnualReportListHead';
import ListToolbar from '../../sections/ListToolbar';
import ReportLoading from './helper-modules/reportLoading';
// locals
import { useGlobalContext } from '../../context';
import { fCurrency } from '../../utils/formatNumber';
import fetchOtherAssets from '../../_apiAxios/annual-reports';
import { applySortFilter, getComparator } from './helper-modules/sortFilterReport';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'reportingMonth', label: 'Reporting Month', alignRight: false },
  { id: 'loanSector', label: 'Loan Type', alignRight: false },
  { id: 'ecl', label: 'Total ECL', alignRight: false },
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

export default function OtherFinancialAssetsReport() {
  const { loggedIn, bankName } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [OTHERASSETLIST, setOTHERASSETLIST] = useState([]);
  const [fetchLink, setFetchLink] = useState(`/ecl-analysis/api/report-other-financial-assets-ecl/${bankName}`);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      setLoading(true);
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
      fetchOtherAssets(setLoading, setOTHERASSETLIST, fetchLink, 'OFA');
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchLink, bankName]
  );

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('registeredOn');

  const [filterOtherAssetID, setFilterOtherAssetID] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    console.log('whats wrong? ', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByOtherAssetID = (event) => {
    setFilterOtherAssetID(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - OTHERASSETLIST.length) : 0;

  const filteredOtherAssets = applySortFilter(OTHERASSETLIST, getComparator(order, orderBy), filterOtherAssetID);

  const isOtherAssetNotFound = filteredOtherAssets.length === 0;

  return (
    <Page title="Annual Report: Other Finincial Assets">
      <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Other Finincial Assets
          </Typography>
        </Stack>
        {loading ? (
          <ReportLoading />
        ) : (
          <Card>
            <ListToolbar
              filterName={filterOtherAssetID}
              onFilterName={handleFilterByOtherAssetID}
              placeHl="Other Finicial Assets ECL by Loan Type"
              reportList={OTHERASSETLIST}
              reportID={{ api: 'ecl-analysis', link: 'report-other-financial-assets-ecl', institute: bankName }}
              setFetchLink={setFetchLink}
            />
            <Scrollbar>
             <Card sx={{ mx: 2, borderRadius: 1 }}>
                <Table size='small'>
                  <OtherAssetListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />

                  <TableBody>
                    {filteredOtherAssets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, reportingMonth, reportingYear, loanSector, ecl, registeredBy, registeredOn } = row;

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
                          <BoxedTableCell align="right">{fCurrency(ecl)}</BoxedTableCell>
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

                  {isOtherAssetNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterOtherAssetID} />
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
              count={OTHERASSETLIST.length}
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
