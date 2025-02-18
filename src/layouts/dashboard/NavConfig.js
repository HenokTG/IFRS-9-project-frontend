// component
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },

  {
    title: 'Analysis',
    path: '/analysis',
    icon: getIcon('ep:data-analysis'),
    requiredRoles: ['Analyst', 'Examiner', 'Client Admin'],
    children: [
      {
        title: 'FLI-CCF Computation',
        path: '/analysis/macro-ccf-analysis',
      },
      {
        title: 'PD input Preparation',
        path: '/analysis/pd-input-data-organizer',
      },
      {
        title: 'ECL Analysis',
        path: '/analysis/ecl-analysis',
      },
    ],
  },
  {
    title: 'Summary Reports',
    path: '/report',
    icon: getIcon('mdi:report-box'),
    children: [
      {
        title: 'Term Loan',
        path: '/report/term-loan',
      },
      {
        title: 'Other Financial Assets',
        path: '/report/other-financial-assets',
      },
      {
        title: 'Cure Rates',
        path: '/report/cure-rate',
      },
      {
        title: 'Collections LGD',
        path: '/report/collections-lgd',
      },
      {
        title: 'Macro Economic and CCF',
        path: '/report/macro-economic-projections-and-ccf',
      },
    ],
  },
  {
    title: 'Documents Download',
    path: '/documents-download',
    icon: getIcon('streamline:download-file'),
    children: [
      {
        title: 'FLI-CCF Computation',
        path: '/documents-download/macro-ccf-analysis',
      },
      {
        title: 'PD input Preparation',
        path: '/documents-download/pd-input-data-organizer',
      },
      {
        title: 'ECL Analysis',
        path: '/documents-download/ecl-analysis',
      },
    ],
  },
  {
    title: 'How to use Guide',
    path: '/documentation',
    icon: getIcon('fluent-mdl2:documentation'),
    children: [
      {
        title: 'FLI-CCF Analysis',
        path: '/documentation/macro-ccf-analysis',
      },
      {
        title: 'PD Organization',
        path: '/documentation/pd-organization',
      },
      {
        title: 'ECL Analysis',
        path: '/documentation/ecl-analysis',
      },
      {
        title: 'View Reports',
        path: '/documentation/summary-reports',
      },
      {
        title: 'Download Doucuments',
        path: '/documentation/download-documents',
      },
    ],
  },

  {
    title: 'Forum',
    path: '/users-forum',
    icon: getIcon('mdi:head-question'),
    requiredRoles: ['Analyst', 'Examiner', 'Client Admin'],
  },
  {
    title: 'Users Management',
    path: '/users-management',
    icon: getIcon('eva:people-fill'),
    requiredRoles: ['Client Admin'],
  },

  {
    title: 'App Settings',
    path: '/app-settings',
    icon: getIcon('eva:settings-fill'),
    requiredRoles: ['Client Admin'],
    children: [
      {
        title: 'Company Information',
        path: '/app-settings/company-info',
        icon: getIcon('fluent-emoji-high-contrast:bank'),
      },
      {
        title: 'Analysis Configurations',
        path: '/app-settings/configurations',
        icon: getIcon('mdi:database-settings'),
      },
    ],
  },
  {
    title: 'About Us',
    path: '/about-and-contact',
    isPubic: true,
    icon: getIcon('hugeicons:developer'),
  },
];

export default navConfig;
