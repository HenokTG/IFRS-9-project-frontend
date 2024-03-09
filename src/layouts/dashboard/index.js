import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardSidebar from './DashboardSidebar';
// context and modules
import fetchAccount from '../../_apiAxios/account';
import { useGlobalContext } from '../../context';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 64;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { loggedIn, profilePk, setProfile, setBankName } = useGlobalContext();

  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState({
    displayName: 'Henok Anshiso',
    email: 'henans1234@gmail.com',
    phone: '+251 920 80 9496',
    role: 'Consultant',
    dept: 'Product Development',
    Institute: 'Tech Company',
    photoURL: 'res.data.image',
    avatorURL: '/static/mock-images/avatars/avatar_default.jpg',
  });

  useEffect(() => {
    fetchAccount(profilePk, setAccount, setProfile, setBankName);
  }, [loggedIn]);

  return (
    <RootStyle>
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} account={account} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
