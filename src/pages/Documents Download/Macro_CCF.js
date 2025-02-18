// components
import Page from 'components/Page';
import MyDataTable from 'components/data-tables/MyDataTable';

import { ResultApproveCell, ResultRemarkCell } from '.';

// ----------------------------------------------------------------------
const tableHeader = [
  { id: 'reportingMonth', label: 'Reporting Month', type: 'text', sortKey: 'reporting_date' },
  { id: 'analyst', label: 'Analyst', type: 'text', sortKey: '' },
  { id: 'analysisDate', label: 'Analysis Date', type: 'date', sortKey: 'analysis_date' },
  { id: 'baseScenario', label: 'Base Scenario (%)', type: 'percentile', sortKey: 'base_scenario' },
  { id: 'downsideScenario', label: 'Downside Scenario (%)', type: 'percentile', sortKey: 'downside_scenario' },
  { id: 'upsideScenario', label: 'Upside Scenario (%)', type: 'percentile', sortKey: 'upside_scenario' },
  { id: 'savedOnServer', label: 'Saved on Server', type: 'bool', sortKey: 'save_to_server' },
  { id: 'excelInput', label: 'Excel Input', type: 'file', sortKey: '' },
  { id: 'excelResult', label: 'Excel Result', type: 'file', sortKey: '' },
  { id: 'resultRemark', label: 'Remark', type: 'resultRemark', sortKey: '' },
  { id: 'resultApproval', label: 'Is Approved', type: 'resultApproval', sortKey: '' },
];

export default function MacroCCFDocs() {
  return (
    <Page title="Documents List: FLI-CCF Analaysis Documents List">
      <MyDataTable
        myTableTitle="FLI-CCF Analaysis Documents List"
        tableHeader={tableHeader}
        fetchCode="Macro"
        placeHl=""
        isDocsFilter
        dataCode="fli_ccf_analysis"
        apiLink="/macro-ccf-analysis/api/analyze-macro-ccf"
        approveAPI="/macro-ccf-analysis/api/approve-macro-result"
        ResultApproveCell={ResultApproveCell}
        ResultRemarkCell={ResultRemarkCell}
      />
    </Page>
  );
}
