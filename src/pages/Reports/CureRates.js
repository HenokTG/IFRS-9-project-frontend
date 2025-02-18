// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: '' },
  { id: 'loanSector', label: 'Loan Sector', type: 'text', sortKey: 'loan_sector' },
  { id: 'totalNumAccounts', label: 'Total No. of Accounts', type: 'number', sortKey: 'total_number_of_accounts' },
  {
    id: 'totalDefAccounts',
    label: 'No. of Defaulted Accounts',
    type: 'number',
    sortKey: 'number_of_defaulted_accounts',
  },
  {
    id: 'totalNumCuredAccounts',
    label: 'No. of Cured Accounts',
    type: 'number',
    sortKey: 'number_of_cured_accounts',
  },
  { id: 'totalAmountCuredAccounts', label: 'Total Cured Amounts', type: 'currency', sortKey: 'total_cured_amounts' },
  { id: 'totalExposureIOD', label: 'Exposure Amount at IOD', type: 'currency', sortKey: 'total_exposure_at_iod' },
  { id: 'cureRate', label: 'Cure Rate', type: 'percentile', sortKey: 'cure_rate' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: 'registered_by' },
  { id: 'registeredOn', label: 'Analysis Date', type: 'date', sortKey: 'registered_on' },
];

export default function SectorCureRates() {
  return (
    <Page title="Summary Report: Cure Rate">
      <MyDataTable
        myTableTitle="Account Cure Rates"
        tableHeader={tableHeader}
        fetchCode="CR"
        dataCode="cure_rates"
        placeHl="account cure rates by loan sector"
        apiLink="/ecl-analysis/api/report-cure-rate/"
      />
    </Page>
  );
}
