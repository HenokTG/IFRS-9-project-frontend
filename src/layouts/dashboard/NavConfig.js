// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },

  {
    title: 'Analysis',
    path: '/analysis',
    icon: getIcon('ep:data-analysis'),
    children: [
      {
        title: 'Macro-CCF Computation',
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
    title: 'Annual Reports',
    path: '/report',
    icon: getIcon('mdi:report-box'),
    children: [
      {
        title: 'Term Loan',
        path: '/report/term-loan-result-summary',
      },
      {
        title: 'Other Financial Assets',
        path: '/report/other-financial-assets-result-summary',
      },
      {
        title: 'Cure Rates',
        path: '/report/cure-rate-result-summary',
      },
      {
        title: 'Collections LGD',
        path: '/report/collections-lgd-result-summary',
      },
      {
        title: 'Macro Economic and CCF',
        path: '/report/macro-economic-projections-and-ccf-result-summary',
      },
    ],
  },
  {
    title: 'How to use Guide',
    path: '/documentation',
    icon: getIcon('fluent-mdl2:documentation'),
    children: [
      {
        title: 'Macro-CCF Analysis',
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
        path: '/documentation/how-to-use-annual-reports',
      },
    ],
  },

  {
    title: 'App Settings',
    path: '/app-settings',
    icon: getIcon('eva:settings-fill'),
    children: [
      {
        title: 'Users Management',
        path: '/app-settings/user-management',
        icon: getIcon('eva:people-fill'),
      },
      {
        title: 'Q & A',
        path: '/app-settings/Q-and-A',
        icon: getIcon('mdi:head-question'),
      },
      // {
      //   title: 'About the App',
      //   path: '/app/app-settings/about-and-contact',
      //   icon: getIcon('carbon:application-web'),
      // },
    ],
  },
];

export default navConfig;
