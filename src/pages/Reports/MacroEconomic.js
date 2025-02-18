// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: '' },
  { id: 'loanSector', label: 'Loan Sector', type: 'text', sortKey: 'loan_sector' },
  { id: 'mepe1', label: 'Year 1', type: 'number', sortKey: 'mepe_1' },
  { id: 'mepe2', label: 'Year 2', type: 'number', sortKey: 'mepe_2' },
  { id: 'mepe3', label: 'Year 3', type: 'number', sortKey: 'mepe_3' },
  { id: 'ccfOD', label: 'Overdraft CCF', type: 'percentile', sortKey: 'ccf_overdraft' },
  { id: 'ccfMex', label: 'Merchendise CCF', type: 'percentile', sortKey: 'ccf_merchandise' },
  { id: 'ccfPres', label: 'Pre-shipment CCF', type: 'percentile', sortKey: 'ccf_preshipment' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: 'registered_by' },
  { id: 'registeredOn', label: 'Analysis Date', type: 'date', sortKey: 'registered_on' },
];

export default function FLIandCCFData() {
  return (
    <Page title="Summary Report: Macro Economic Prejection and CCF">
      <MyDataTable
        myTableTitle="Macro Economic Projection and CCF"
        tableHeader={tableHeader}
        fetchCode="Macro_CCF"
        dataCode="fli_ccf"
        placeHl="FLI & CCF by loan sector"
        apiLink="/macro-ccf-analysis/api/report-macro/"
      />
    </Page>
  );
}
