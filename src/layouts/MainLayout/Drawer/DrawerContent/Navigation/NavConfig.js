// component
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    type: 'item',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    id: 'analysis',
    title: 'Analysis',
    type: 'collapse',
    icon: getIcon('ep:data-analysis'),
    requiredRoles: ['Analyst', 'Examiner', 'Client Admin'],
    children: [
      { id: 'fli-ccf', type: 'item', title: 'FLI-CCF Computation', path: '/analysis/macro-ccf-analysis' },
      { id: 'pd', type: 'item', title: 'PD input Preparation', path: '/analysis/pd-input-data-organizer' },
      { id: 'ecl', type: 'item', title: 'ECL Analysis', path: '/analysis/ecl-analysis' },
    ],
  },
  {
    id: 'summary',
    title: 'Summary Reports',
    type: 'collapse',
    icon: getIcon('mdi:report-box'),
    children: [
      { id: 'tl', type: 'item', title: 'Term Loan', path: '/report/term-loan' },
      { id: 'ofa', type: 'item', title: 'Other Financial Assets', path: '/report/other-financial-assets' },
      { id: 'cr', type: 'item', title: 'Cure Rates', path: '/report/cure-rate' },
      { id: 'coll', type: 'item', title: 'Collections LGD', path: '/report/collections-lgd' },
      {
        id: 'macro-ccf',
        type: 'item',
        title: 'Macro Economic and CCF',
        path: '/report/macro-economic-projections-and-ccf',
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents Download',
    type: 'collapse',
    icon: getIcon('streamline:download-file'),
    children: [
      { id: 'macro-docs', type: 'item', title: 'FLI-CCF Computation', path: '/documents-download/macro-ccf-analysis' },
      {
        id: 'pd-docs',
        type: 'item',
        title: 'PD input Preparation',
        path: '/documents-download/pd-input-data-organizer',
      },
      { id: 'ecl-docs', type: 'item', title: 'ECL Analysis', path: '/documents-download/ecl-analysis' },
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to use Guide',
    type: 'collapse',
    icon: getIcon('fluent-mdl2:documentation'),
    children: [
      { id: 'macro-guides', type: 'item', title: 'FLI-CCF Analysis', path: '/documentation/macro-ccf-analysis' },
      { id: 'pd-guides', type: 'item', title: 'PD Organization', path: '/documentation/pd-organization' },
      { id: 'ecl-guides', type: 'item', title: 'ECL Analysis', path: '/documentation/ecl-analysis' },
      {
        type: 'item',
        id: 'reports-guides',
        title: 'View Reports',
        path: '/documentation/summary-reports',
      },
      { id: 'docs-guides', type: 'item', title: 'Download Doucuments', path: '/documentation/download-documents' },
    ],
  },

  {
    id: 'forum',
    type: 'item',
    title: 'Forum',
    path: '/users-forum',
    icon: getIcon('mdi:head-question'),
    requiredRoles: ['Analyst', 'Examiner', 'Client Admin'],
  },
  {
    type: 'item',
    id: 'users-management',
    title: 'Users Management',
    path: '/users-management',
    icon: getIcon('eva:people-fill'),
    requiredRoles: ['Client Admin'],
  },
  {
    type: 'collapse',
    id: 'app-settings',
    title: 'App Settings',
    icon: getIcon('eva:settings-fill'),
    requiredRoles: ['Client Admin'],
    children: [
      {
        type: 'item',
        id: 'company-information',
        title: 'Company Information',
        path: '/app-settings/company-info',
        icon: getIcon('fluent-emoji-high-contrast:bank'),
      },
      {
        type: 'item',
        id: 'analysis-configurations',
        title: 'Analysis Configurations',
        path: '/app-settings/configurations',
        icon: getIcon('mdi:database-settings'),
      },
    ],
  },
  {
    type: 'item',
    id: 'about-us',
    title: 'About Us',
    path: '/about-and-contact',
    isPubic: true,
    icon: getIcon('hugeicons:developer'),
  },
];

export default navConfig;
