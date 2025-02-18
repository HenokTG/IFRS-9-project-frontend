import moment from 'moment';

import { axiosInstance } from 'utils/axios';

const termLoansList = (fetchData) =>
  fetchData.map((tl) => ({
    id: tl.unique_id,
    reportingMonth: `${tl.reporting_month} - ${tl.reporting_year}`,
    loanSector: tl.loan_sector,
    stage1: tl.stage_1_ecl,
    stage2: tl.stage_2_ecl,
    stage3: tl.stage_3_ecl,
    analyst: tl.registered_by,
    registeredOn: moment(tl.registered_on).format('ddd, MMM DD YYYY'),
  }));

const otherAssetsList = (fetchData) =>
  fetchData.map((ofa) => ({
    id: ofa.unique_id,
    reportingMonth: `${ofa.reporting_month} - ${ofa.reporting_year}`,
    loanSector: ofa.loan_type,
    ecl: ofa.ecl,
    analyst: ofa.registered_by,
    registeredOn: moment(ofa.registered_on).format('ddd, MMM DD YYYY'),
  }));

const cureRateList = (fetchData) =>
  fetchData.map((cr) => ({
    id: cr.unique_id,
    reportingMonth: `${cr.reporting_month} - ${cr.reporting_year}`,
    loanSector: cr.loan_sector,
    totalNumAccounts: cr.total_number_of_accounts,
    totalDefAccounts: cr.number_of_defaulted_accounts,
    totalNumCuredAccounts: cr.number_of_cured_accounts,
    totalAmountCuredAccounts: cr.total_cured_amounts,
    totalExposureIOD: cr.total_exposure_at_iod,
    cureRate: cr.cure_rate * 100,
    analyst: cr.registered_by,
    registeredOn: moment(cr.registered_on).format('ddd, MMM DD YYYY'),
  }));

const collectionLGDList = (fetchData) =>
  fetchData.map((coll) => ({
    id: coll.unique_id,
    reportingMonth: `${coll.reporting_month} - ${coll.reporting_year}`,
    loanSector: coll.loan_sector,
    weightedRR: coll.weighted_rr * 100,
    cureRate: coll.cure_rate * 100,
    collLGD: coll.coll_lgd * 100,
    analyst: coll.registered_by,
    registeredOn: moment(coll.registered_on).format('ddd, MMM DD YYYY'),
  }));

const macroCCFList = (fetchData) =>
  fetchData.map((fliccf) => ({
    id: fliccf.unique_id,
    reportingMonth: `${fliccf.reporting_month} - ${fliccf.reporting_year}`,
    loanSector: fliccf.loan_sector,
    mepe1: fliccf.mepe_1?.toFixed(6),
    mepe2: fliccf.mepe_2?.toFixed(6),
    mepe3: fliccf.mepe_3?.toFixed(6),
    ccfOD: fliccf.ccf_overdraft * 100,
    ccfMex: fliccf.ccf_merchandise * 100,
    ccfPres: fliccf.ccf_preshipment * 100,
    analyst: fliccf.registered_by,
    registeredOn: moment(fliccf.registered_on).format('ddd, MMM DD YYYY'),
  }));

const macroCCFFilesInfoListsInfo = (fetchData) =>
  fetchData.map((macro) => ({
    id: macro.id,
    reportingMonth: moment(macro.reporting_date).format('MMMM - YYYY'),

    baseScenario: macro.base_scenario,
    downsideScenario: macro.downside_scenario,
    upsideScenario: macro.upside_scenario,

    excelInput: macro.upload_excel,
    excelResult: macro.result_excel,

    savedOnServer: macro.save_to_server ? 'Yes' : 'No',
    analyst: macro.analyst?.first_name
      ? `${macro.analyst?.first_name} ${macro.analyst?.last_name || ''}`
      : macro.analyst?.username,

    resultApproval: macro.result_approved ? 'Yes' : 'No',
    resultRemark: macro.remark_on_result,

    get analysisDate() {
      const dbDate = new Date(macro.analysis_date).toString();
      return dbDate.split('G')[0];
    },
  }));

const pdOrgFilesInfoList = (fetchData) =>
  fetchData.map((pd) => ({
    id: pd.id,
    reportingMonth: moment(pd.reporting_date).format('MMMM - YYYY'),

    monthsToAdd: pd.months_to_add,

    excelInput: pd.upload_excel,
    parquetInput: pd.upload_parquet,
    excelResult: pd.result_excel,
    parquetResult: pd.result_parquet,

    analyst: pd.analyst?.first_name ? `${pd.analyst?.first_name} ${pd.analyst?.last_name || ''}` : pd.analyst?.username,
    profilePk: pd.analyst.username,

    resultApproval: pd.result_approved ? 'Yes' : 'No',
    resultRemark: pd.remark_on_result,

    get analysisDate() {
      const dbDate = new Date(pd.analysis_date).toString();
      return dbDate.split('G')[0];
    },
  }));

const eclFilesInfoList = (fetchData) =>
  fetchData.map((ecl) => ({
    id: ecl.id,
    reportingMonth: moment(ecl.reporting_date).format('MMMM - YYYY'),

    excelResult: ecl.result_excel,
    excelInput: ecl.upload_excel,
    parquetInput: ecl.upload_parquet,

    minLGD: ecl.min_LGD,
    minPD: ecl.min_PD,
    OACCF: ecl.other_assets_CCF,

    monthForImpairment: ecl.month_to_impair,
    savedOnServer: ecl.save_to_server ? 'Yes' : 'No',

    resultApproval: ecl.result_approved ? 'Yes' : 'No',
    resultRemark: ecl.remark_on_result,

    analyst: ecl.analyst?.first_name
      ? `${ecl.analyst?.first_name} ${ecl.analyst?.last_name || ''}`
      : ecl.analyst?.username,

    get analysisDate() {
      const dbDate = new Date(ecl.analysis_date).toString();
      return dbDate.split('G')[0];
    },
  }));

export const fetchDocumentsInfo = (fetchLink, analysisCode) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(fetchLink)
      .then(async (res) => {
        let fetchedFileList = [];

        if (analysisCode === 'Macro') {
          fetchedFileList = await macroCCFFilesInfoListsInfo(res.data.results);
        } else if (analysisCode === 'ECL') {
          fetchedFileList = await eclFilesInfoList(res.data.results);
        } else if (analysisCode === 'PD') {
          fetchedFileList = await pdOrgFilesInfoList(res.data.results);
        }

        resolve({ data: fetchedFileList, count: res.data.count, filtersAvailable: res.data.filter_set });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchTableData = (fetchLink, fetchCode, filter) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(fetchLink, filter, null)
      .then(async (res) => {
        let fetchedTableData = [];
        if (fetchCode === 'TL') {
          fetchedTableData = await termLoansList(res.data.results);
        } else if (fetchCode === 'OFA') {
          fetchedTableData = await otherAssetsList(res.data.results);
        } else if (fetchCode === 'CR') {
          fetchedTableData = await cureRateList(res.data.results);
        } else if (fetchCode === 'Coll_LDG') {
          fetchedTableData = await collectionLGDList(res.data.results);
        } else if (fetchCode === 'Macro_CCF') {
          fetchedTableData = await macroCCFList(res.data.results);
        }

        resolve({ data: fetchedTableData, count: res.data.count, filtersAvailable: res.data.filter_set });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default fetchTableData;
