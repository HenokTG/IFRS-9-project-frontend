import { useState, useEffect } from 'react';

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
import { styled, useTheme } from '@mui/material/styles';

import { ThemeMode } from 'config';

// context and modules
import { fetchUsers } from '_apiAxios/account';
import { applySortFilter, getComparator } from 'utils/helper-modules/sortFilterReport';

// components
import Page from 'components/Page';
import Label from 'components/Label';
import Scrollbar from 'components/Scrollbar';
import Iconify from 'components/Iconify';
import SearchNotFound from 'components/SearchNotFound';
import { UserListHead, MoreMenu } from 'sections/users';
import ListToolbar from 'sections/data-table/TableToolbar';
import ListLoading from 'utils/helper-modules/listLoading';
import AdminAddUser from './AdminAddUser';
import AdminUpdateUserDetail from './AdminUpdateUserDetail';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'user', label: 'User ID', alignRight: false },
  { id: 'name', label: 'Full Name', alignRight: false },
  { id: 'department', label: 'Department', alignRight: false },
  { id: 'jobTitle', label: 'Job Title', alignRight: false },
  { id: 'phone', label: 'Phone Number', alignRight: false },
  { id: 'email', label: 'Email Address', alignRight: false },
  { id: 'privilege', label: 'Privilege', alignRight: false },
  { id: 'isActive', label: 'Active', alignRight: false },
  { id: 'isConfirmed', label: 'Confirmed', alignRight: false },
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
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const [USERLIST, setUsersList] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterByUserName, setFilterByUserName] = useState('');

  const [refreshTime, setRefreshTime] = useState(null);

  useEffect(
    () => {
      setLoading(true);

      fetchUsers()
        .then((users) => {
          setLoading(false);
          setUsersList(users);
        })
        .catch(() => {
          setLoading(false);
          setUsersList([]);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshTime]
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

  const matchColor = (privilege) => {
    let flagColor;

    if (privilege === 'Client Admin') flagColor = 'success';
    else if (privilege === 'Examiner') flagColor = 'warning';
    else if (privilege === 'Management') flagColor = 'error';
    else flagColor = 'info';

    return flagColor;
  };

  const isDarkMode = theme.palette.mode === ThemeMode.DARK;

  const [openAddUser, setOpenAddUser] = useState(false);
  const [openUpdateUser, setOpenUpdateUser] = useState(false);

  const [userID, setUserID] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  return (
    <Page title="Users List">
      <AdminAddUser open={openAddUser} setOpen={setOpenAddUser} setRefreshTime={setRefreshTime} />
      <AdminUpdateUserDetail
        open={openUpdateUser}
        setOpen={setOpenUpdateUser}
        setRefreshTime={setRefreshTime}
        updateData={updateData}
        userID={userID}
      />
      <Container sx={{ px: { xs: 0, sm: 0 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users List
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setOpenAddUser(true);
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Stack>

        {loading ? (
          <ListLoading />
        ) : (
          <Card>
            <ListToolbar
              filterName={filterByUserName}
              onFilterName={handleFilterByUserName}
              placeHl="Full Name"
              setRefreshTime={setRefreshTime}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, paddingInline: '2rem' }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody className="striped">
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        id,
                        user,
                        name,
                        email,
                        department,
                        phone,
                        jobTitle,
                        imageUrl,
                        avatarUrl,
                        privilege,
                        isActive,
                        isConfirmed,
                      } = row;

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
                            <Label variant={isDarkMode ? 'filled' : 'ghost'} color={matchColor(privilege)}>
                              {privilege}
                            </Label>
                          </BoxedTableCell>
                          <BoxedTableCell align="center">
                            <Label variant={isDarkMode ? 'filled' : 'ghost'} color={isActive ? 'success' : 'error'}>
                              {isActive ? 'Yes' : 'No'}
                            </Label>
                          </BoxedTableCell>
                          <BoxedTableCell align="center">
                            <Label variant={isDarkMode ? 'filled' : 'ghost'} color={isConfirmed ? 'success' : 'error'}>
                              {isConfirmed ? 'Yes' : 'No'}
                            </Label>
                          </BoxedTableCell>

                          <TableCell align="right">
                            {privilege !== 'Client Admin' && (
                              <MoreMenu
                                openUpdateModal={() => {
                                  setUserID(user);
                                  setOpenUpdateUser(true);
                                  setUpdateData({ isActive, privilege });
                                }}
                                setRefreshTime={setRefreshTime}
                                deletePath={`users/api/${id}/delete`}
                                renewActivation={`users/api/${id}/renew-activation-link`}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={10} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
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
