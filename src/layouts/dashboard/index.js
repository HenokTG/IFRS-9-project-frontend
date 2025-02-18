import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';

// context and modules
import { useGlobalContext } from 'contexts/AppContext';

// components
import DashboardSidebar from './DashboardSidebar';

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
  const { profile } = useGlobalContext();

  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} account={profile} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
