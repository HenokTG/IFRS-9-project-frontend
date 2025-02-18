// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: '' },
  { id: 'loanSector', label: 'Loan Sector', type: 'text', sortKey: 'loan_sector' },
  { id: 'stage1', label: 'Stage 1 ECL', type: 'currency', sortKey: 'stage_1_ecl' },
  { id: 'stage2', label: 'Stage 2 ECL', type: 'currency', sortKey: 'stage_2_ecl' },
  { id: 'stage3', label: 'Stage 3 ECL', type: 'currency', sortKey: 'stage_3_ecl' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: 'registered_by' },
  { id: 'registeredOn', label: 'Analysis Date', type: 'date', sortKey: 'registered_on' },
];

export default function TermLoanReport() {
  return (
    <Page title="Summary Report: Term Loan">
      <MyDataTable
        myTableTitle="Term Loan ECL"
        tableHeader={tableHeader}
        fetchCode="TL"
        dataCode="term_loan"
        placeHl="term loan ECL by loan sector"
        apiLink="/ecl-analysis/api/report-term-loan-ecl/"
      />
    </Page>
  );
}
