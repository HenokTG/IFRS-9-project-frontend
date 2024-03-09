import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';
import { UserListHead, MoreMenu } from '../../../sections/users';
import ListToolbar from '../../../sections/ListToolbar';
import ReportLoading from '../../Reports/helper-modules/reportLoading';

// context and modules
import { useGlobalContext } from '../../../context';
import { fetchUsers } from '../../../_apiAxios/customer-fetch';
import { applySortFilter, getComparator } from '../../Reports/helper-modules/sortFilterReport';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'user', label: 'User ID', alignRight: false },
  { id: 'name', label: 'Full Name', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'jobTitle', label: 'Job Title', alignRight: false },
  { id: 'phone', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email Address', alignRight: false },
  { id: 'isAdmin', label: 'Privilage', alignRight: false },
  { id: '' },
];
const BoxedTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    borderRightWidth: '1px',
  },
}));

// ----------------------------------------------------------------------

export default function UsersList() {
  const [loading, setLoading] = useState(true);
  const [isUserDeleted, setIsUserDeleted] = useState(false);

  const [USERLIST, setUSERLIST] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterByUserName, setFilterByUserName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { loggedIn } = useGlobalContext();
  const navigate = useNavigate();
  const prevLocation = useLocation();

  useEffect(
    () => {
      setLoading(true);
      if (loggedIn === false) {
        navigate(`/login?redirectTo=${prevLocation.pathname}`);
      }
      fetchUsers(setLoading, setUSERLIST);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUserDeleted]
  );

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

  const handleFilterByUserName = (event) => {
    setFilterByUserName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterByUserName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Users List">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users List
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/app/app-settings/user-management/admin-add-user"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>

        {loading ? (
          <ReportLoading />
        ) : (
          <Card>
            <ListToolbar filterName={filterByUserName} onFilterName={handleFilterByUserName} placeHl="Full Name" />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, paddingInline: '2rem' }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, user, name, email, department, phone, jobTitle, imageUrl, avatarUrl, privilage } =
                        row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <BoxedTableCell component="th" scope="row">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar src={imageUrl} alt={name}>
                                <Avatar alt="agent avator" src={avatarUrl} />
                              </Avatar>
                              <Typography variant="subtitle2" noWrap>
                                {user}
                              </Typography>
                            </Stack>
                          </BoxedTableCell>
                          <BoxedTableCell align="left">{name}</BoxedTableCell>
                          <BoxedTableCell align="left">{department}</BoxedTableCell>
                          <BoxedTableCell align="left">{jobTitle}</BoxedTableCell>
                          <BoxedTableCell align="left">{phone}</BoxedTableCell>
                          <BoxedTableCell align="left">{email}</BoxedTableCell>
                          <BoxedTableCell align="center">
                            <Label variant="ghost" color={privilage === 'Admin' ? 'info' : 'default'}>
                              {privilage}
                            </Label>
                          </BoxedTableCell>

                          <TableCell align="right">
                            <MoreMenu
                              updateLink={`/app/app-settings/user-management/admin-update-user-detail/userI-id=${id}`}
                              deletePath={`users/api/profiles/${id}/`}
                              setDeleted={setIsUserDeleted}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterByUserName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
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
