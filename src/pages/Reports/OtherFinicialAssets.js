// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: '' },
  { id: 'loanSector', label: 'Loan Type', type: 'text', sortKey: 'loan_type' },
  { id: 'ecl', label: 'Total ECL', type: 'currency', sortKey: 'ecl' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: 'registered_by' },
  { id: 'registeredOn', label: 'Analysis Date', type: 'date', sortKey: 'registered_on' },
];

export default function OtherFinancialAssetsReport() {
  return (
    <Page title="Summary Report: Other Finincial Assets">
      <MyDataTable
        myTableTitle="Other Finincial Assets"
        tableHeader={tableHeader}
        fetchCode="OFA"
        dataCode="other_assets"
        placeHl="other finicial assets ECL by loan type"
        apiLink="/ecl-analysis/api/report-other-financial-assets-ecl/"
      />
    </Page>
  );
}
