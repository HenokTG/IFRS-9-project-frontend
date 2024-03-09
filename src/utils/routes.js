import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Profile from './pages/Profile';
import ProfileUpdate from './pages/ProfileUpdate';
import Agent from './pages/Agent';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import CardPurchases from './pages/CardPurchases';
import {
  AgentAdd,
  AgentUpdate,
  AddPackage,
  UpdatePackage,
  AddPromoCode,
  UpdatePromoCode,
  Packages,
  PromoCodes,
} from './pages/ManageModels';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard/',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <DashboardApp /> },
        { path: 'agents', element: <Agent /> },
        { path: 'card-purchases', element: <CardPurchases /> },
        { path: 'agent-profile', element: <Profile /> },
        { path: 'agent-update', element: <AgentUpdate /> },
        { path: 'agent-add', element: <AgentAdd /> },
        { path: 'manage-models/Packages/add', element: <AddPackage /> },
        { path: 'manage-models/Packages/update', element: <UpdatePackage /> },
        { path: 'manage-models/Promo-codes/add', element: <AddPromoCode /> },
        { path: 'manage-models/Promo-codes/update', element: <UpdatePromoCode /> },
        { path: 'manage-models/Packages', element: <Packages /> },
        { path: 'manage-models/Promo-codes', element: <PromoCodes /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: 'agent-profile-update',
      element: <ProfileUpdate />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
