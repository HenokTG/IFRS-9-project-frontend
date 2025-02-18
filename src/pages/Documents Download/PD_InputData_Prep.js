// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

import { ResultApproveCell, ResultRemarkCell } from '.';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: 'reporting_date' },
  { id: 'analyst', label: 'Analyst', type: 'file', sortKey: '' },
  { id: 'analysisDate', label: 'Analysis Date', type: 'date', sortKey: 'analysis_date' },
  { id: 'monthsToAdd', label: 'Months to Add', type: 'number', sortKey: 'analysis_date' },
  { id: 'excelInput', label: 'Excel Input', type: 'file', sortKey: '' },
  { id: 'parquetInput', label: 'Parquet Input', type: 'file', sortKey: '' },
  { id: 'excelResult', label: 'Excel Result', type: 'file', sortKey: '' },
  { id: 'parquetResult', label: 'Parquet Result', type: 'file', sortKey: '' },
  { id: 'resultRemark', label: 'Remark', type: 'resultRemark', sortKey: '' },
  { id: 'resultApproval', label: 'Is Approved', type: 'resultApproval', sortKey: '' },
];

export default function PDorgDocs() {
  return (
    <Page title="Documents List: PD Organization">
      <MyDataTable
        myTableTitle="PD Organization Documents List"
        tableHeader={tableHeader}
        fetchCode="PD"
        placeHl=""
        isDocsFilter
        dataCode="pd_analysis"
        apiLink="/pd-input-data-organizer/api/orginize-pd"
        approveAPI="/pd-input-data-organizer/api/approve-pd-result"
        ResultApproveCell={ResultApproveCell}
        ResultRemarkCell={ResultRemarkCell}
      />
    </Page>
  );
}
