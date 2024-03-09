import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//

import DashboardApp from './pages/Dashboard';
import About from './pages/App Setttings/About';
import QuestionAnswer from './pages/App Setttings/Q-&-A';
import QuestionForm from './pages/App Setttings/QuestionForm';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';

import { MacroCCF, PDorg, ECLAnalysis } from './pages/Analysis';
import { ReportTL, ReportOFA, ReportCR, ReportCL, ReportMacro } from './pages/Reports';
import { DocMacroCCF, DocPDorg, DocECLAnalysis, DocAnnualReport } from './pages/Documentations';
import { UsersList, AdminAddUser, AdminUpdateUserDetail } from './pages/App Setttings/User Management';
import { Profile, UpdateProfile } from './pages/App Setttings/Profile Management';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard/', element: <DashboardApp /> },
        { path: 'users/', element: <UsersList /> },
        {
          path: 'analysis/',
          children: [
            { path: 'macro-ccf-analysis', element: <MacroCCF /> },
            { path: 'pd-input-data-organizer', element: <PDorg /> },
            { path: 'ecl-analysis', element: <ECLAnalysis /> },
          ],
        },
        {
          path: 'report/',
          children: [
            { path: 'term-loan-result-summary', element: <ReportTL /> },
            { path: 'other-financial-assets-result-summary', element: <ReportOFA /> },
            { path: 'cure-rate-result-summary', element: <ReportCR /> },
            { path: 'collections-lgd-result-summary', element: <ReportCL /> },
            { path: 'macro-economic-projections-and-ccf-result-summary', element: <ReportMacro /> },
          ],
        },
        {
          path: 'documentation/',
          children: [
            { path: 'macro-ccf-analysis', element: <DocMacroCCF /> },
            { path: 'pd-organization', element: <DocPDorg /> },
            { path: 'ecl-analysis', element: <DocECLAnalysis /> },
            { path: 'how-to-use-annual-reports', element: <DocAnnualReport /> },
          ],
        },
        {
          path: 'app-settings/',
          children: [
            {
              path: 'about-and-contact',
              element: <About />,
            },
            {
              path: 'Q-and-A',
              children: [
                { path: '', element: <QuestionAnswer /> },
                { path: 'ask', element: <QuestionForm /> },
                { path: 'edit/:faqID', element: <QuestionForm /> },
              ],
            },
            {
              path: 'user-management/',
              children: [
                { path: '', element: <UsersList /> },
                { path: 'admin-add-user', element: <AdminAddUser /> },
                { path: 'admin-update-user-detail/:userID/', element: <AdminUpdateUserDetail /> },
              ],
            },
            {
              path: 'user-profile/',
              children: [
                { path: '', element: <Profile /> },
                { path: 'update', element: <UpdateProfile /> },
              ],
            },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    { path: 'register', element: <Register /> },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { index: true, element: <Navigate to="/login" /> },
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
