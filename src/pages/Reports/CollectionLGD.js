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
import CollectionLGDListHead from '../../sections/annualReport/AnnualReportListHead';
import ListToolbar from '../../sections/ListToolbar';
import ReportLoading from './helper-modules/reportLoading';

// locals
import { useGlobalContext } from '../../context';
import { fPercent } from '../../utils/formatNumber';
import fetchCollectionLGD from '../../_apiAxios/annual-reports';
import { applySortFilter, getComparator } from './helper-modules/sortFilterReport';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'reportingMonth', label: 'Reporting Month', alignRight: false },
  { id: 'loanSector', label: 'Loan Sector', alignRight: false },
  { id: 'weightedRR', label: 'Weighted Recovery Rate', alignRight: false },
  { id: 'cureRate', label: 'Cure Rate', alignRight: false },
  { id: 'collLGD', label: 'Collection LGD', alignRight: false },
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

export default function CollectionsLGD() {
  const { loggedIn, bankName } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [COLLECTIONLDGLIST, setCOLLECTIONLDGLIST] = useState([]);
  const [fetchLink, setFetchLink] = useState(`/ecl-analysis/api/report-collection-lgd/${bankName}`);

  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      setLoading(true);
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
      fetchCollectionLGD(setLoading, setCOLLECTIONLDGLIST, fetchLink, 'Coll_LDG');
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchLink]
  );

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('registeredOn');

  const [filterCollectionLGDID, setFilterCollectionLGDID] = useState('');

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

  const handleFilterByCollectionLGDID = (event) => {
    setFilterCollectionLGDID(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - COLLECTIONLDGLIST.length) : 0;

  const filteredCollectionLGD = applySortFilter(
    COLLECTIONLDGLIST,
    getComparator(order, orderBy),
    filterCollectionLGDID
  );

  const isCollLGDNotFound = filteredCollectionLGD.length === 0;

  return (
    <Page title="Annual Report: Collection LGD">
      <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Collection LGD
          </Typography>
        </Stack>
        {loading ? (
          <ReportLoading />
        ) : (
          <Card>
            <ListToolbar
              filterName={filterCollectionLGDID}
              onFilterName={handleFilterByCollectionLGDID}
              placeHl="Collection LGDs by Loan Sector"
              reportList={COLLECTIONLDGLIST}
              reportID={{ api: 'ecl-analysis', link: 'report-collection-lgd', institute: bankName }}
              setFetchLink={setFetchLink}
            />
            <Scrollbar>
              <Card sx={{ mx: 2, borderRadius: 1 }}>
                <Table size="small">
                  <CollectionLGDListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredCollectionLGD.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        reportingMonth,
                        reportingYear,
                        loanSector,
                        weightedRR,
                        cureRate,
                        collLGD,
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
                          <BoxedTableCell align="right">{fPercent(weightedRR)}</BoxedTableCell>
                          <BoxedTableCell align="right">{fPercent(cureRate)}</BoxedTableCell>
                          <BoxedTableCell align="right">{fPercent(collLGD)}</BoxedTableCell>
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

                  {isCollLGDNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterCollectionLGDID} />
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
              count={COLLECTIONLDGLIST.length}
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
