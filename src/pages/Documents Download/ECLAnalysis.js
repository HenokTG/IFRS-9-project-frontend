// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

import { ResultApproveCell, ResultRemarkCell } from '.';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: 'reporting_date' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: '' },
  { id: 'analysisDate', label: 'Analysis Date', type: 'date', sortKey: 'analysis_date' },
  { id: 'minLGD', label: 'Minimum LGD (%)', type: 'percentile', sortKey: 'min_LGD' },
  { id: 'minPD', label: 'Minimum PD (%)', type: 'percentile', sortKey: 'min_PD' },
  { id: 'OACCF', label: 'OFA CCF(%)', type: 'percentile', sortKey: 'other_assets_CCF' },
  { id: 'monthForImpairment', label: 'Impairment Start Month', type: 'number', sortKey: 'month_to_impair' },
  { id: 'savedOnServer', label: 'Saved on Server', type: 'bool', sortKey: 'save_to_server' },
  { id: 'excelInput', label: 'Excel Input', type: 'file', sortKey: '' },
  { id: 'parquetInput', label: 'Parquet Input', type: 'file', sortKey: '' },
  { id: 'excelResult', label: 'Excel Result', type: 'file', sortKey: '' },
  { id: 'resultRemark', label: 'Remark', type: 'resultRemark', sortKey: '' },
  { id: 'resultApproval', label: 'Is Approved', type: 'resultApproval', sortKey: '' },
];

// ---------------------------------------------------------- Result Table -----------------------------------------------------

export default function ECLAnalysisDocs() {
  return (
    <Page title="Documents List: ECL Analyis Document List">
      <MyDataTable
        myTableTitle="ECL Analyis Document List"
        tableHeader={tableHeader}
        fetchCode="ECL"
        placeHl=""
        isDocsFilter
        dataCode="ecl_analysis"
        apiLink="/ecl-analysis/api/analyze-ecl"
        approveAPI="/ecl-analysis/api/approve-ecl-result"
        ResultApproveCell={ResultApproveCell}
        ResultRemarkCell={ResultRemarkCell}
      />
    </Page>
  );
}
