// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: '' },
  { id: 'loanSector', label: 'Loan Sector', type: 'text', sortKey: 'loan_sector' },
  { id: 'weightedRR', label: 'Weighted Recovery Rate', type: 'percentile', sortKey: 'weighted_rr' },
  { id: 'cureRate', label: 'Cure Rate', type: 'percentile', sortKey: 'cure_rate' },
  { id: 'collLGD', label: 'Collection LGD', type: 'percentile', sortKey: 'coll_lgd' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: 'registered_by' },
  { id: 'registeredOn', label: 'Analysis Date', type: 'date', sortKey: 'registered_on' },
];

export default function CollectionsLGD() {
  return (
    <Page title="Summary Report: Collection LGD">
      <MyDataTable
        myTableTitle="Collection LGD"
        tableHeader={tableHeader}
        fetchCode="Coll_LDG"
        dataCode="coll_lgd"
        placeHl="collection LGD by loan sector"
        apiLink="/ecl-analysis/api/report-collection-lgd/"
      />
    </Page>
  );
}
