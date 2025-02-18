import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import MainLayout from 'layouts/MainLayout';
// import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';

// pages
import Login from 'pages/Login';
import RequestPasswordReset from 'pages/PasswordResetRequest';
import ResetPassword from 'pages/PasswordReset';

import NotFound from 'pages/Page404';

import SummaryDashboard from 'pages/Dashboard';
import About from 'pages/App Setttings/About';
import QuestionAnswer from 'pages/App Setttings/Q-&-A';
import QuestionForm from 'pages/App Setttings/QuestionForm';

import { MacroCCF, PDorg, ECLAnalysis } from 'pages/Analysis';
import { ReportTL, ReportOFA, ReportCR, ReportCL, ReportMacro } from 'pages/Reports';
import {
  HowToMacroCCF,
  HowToPDorg,
  HowToECLAnalysis,
  HowToAnnualReport,
  HowToDownloadDocumennts,
} from 'pages/Documentations';
import Profile from 'pages/User Profile';
import MyNotifications from 'pages/My Notifications';
import CompanyInfo from 'pages/App Setttings/Company Info';
import CompanyConfigs from 'pages/App Setttings/Company Configs';
import { MacroCCFDocs, PDorgDocs, ECLAnalysisDocs } from 'pages/Documents Download';
import { UsersList } from 'pages/User Management';

import ProtectedRoute from 'utils/guard-routes';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard/',
          element: <ProtectedRoute />,
          children: [{ path: '', element: <SummaryDashboard /> }],
        },
        {
          path: 'analysis/',
          element: <ProtectedRoute userRole={['Analyst', 'Examiner', 'Client Admin']} />,
          children: [
            { path: 'ecl-analysis', element: <ECLAnalysis /> },
            { path: 'macro-ccf-analysis', element: <MacroCCF /> },
            { path: 'pd-input-data-organizer', element: <PDorg /> },
          ],
        },
        {
          path: 'report/',
          element: <ProtectedRoute />,
          children: [
            { path: 'term-loan', element: <ReportTL /> },
            { path: 'cure-rate', element: <ReportCR /> },
            { path: 'collections-lgd', element: <ReportCL /> },
            { path: 'other-financial-assets', element: <ReportOFA /> },
            { path: 'macro-economic-projections-and-ccf', element: <ReportMacro /> },
          ],
        },
        {
          path: 'documents-download/',
          element: <ProtectedRoute />,
          children: [
            { path: 'ecl-analysis', element: <ECLAnalysisDocs /> },
            { path: 'macro-ccf-analysis', element: <MacroCCFDocs /> },
            { path: 'pd-input-data-organizer', element: <PDorgDocs /> },
          ],
        },
        {
          path: 'documentation/',
          element: <ProtectedRoute />,
          children: [
            { path: 'pd-organization', element: <HowToPDorg /> },
            { path: 'ecl-analysis', element: <HowToECLAnalysis /> },
            { path: 'macro-ccf-analysis', element: <HowToMacroCCF /> },
            { path: 'summary-reports', element: <HowToAnnualReport /> },
            { path: 'download-documents', element: <HowToDownloadDocumennts /> },
          ],
        },
        {
          path: 'users-forum/',
          element: <ProtectedRoute userRole={['Analyst', 'Examiner', 'Client Admin']} />,
          children: [
            { path: '', element: <QuestionAnswer /> },
            { path: 'ask', element: <QuestionForm /> },
            { path: 'edit/:faqID', element: <QuestionForm /> },
          ],
        },
        {
          path: 'users-management/',
          element: <ProtectedRoute userRole={['Client Admin']} />,
          children: [{ path: '', element: <UsersList /> }],
        },
        {
          path: 'app-settings/',
          element: <ProtectedRoute userRole={['Client Admin']} />,
          children: [
            { path: 'company-info/', element: <CompanyInfo /> },
            { path: 'configurations/', element: <CompanyConfigs /> },
          ],
        },
        {
          path: 'about-and-contact/',
          children: [{ path: '', element: <About /> }],
        },
        {
          path: 'my-profile/',
          element: <ProtectedRoute />,
          children: [{ path: '', element: <Profile /> }],
        },
        {
          path: 'my-notifications/',
          element: <ProtectedRoute />,
          children: [{ path: '', element: <MyNotifications /> }],
        },
      ],
    },
    { path: 'login', element: <Login /> },
    { path: 'forget-password', element: <RequestPasswordReset /> },
    { path: 'reset-password/:uidb64/:token/', element: <ResetPassword /> },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { index: true, element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: '404', element: <NotFound /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
