import { axiosInstance } from '../utils/axios';

const termLoansList = (fetchData) =>
  fetchData.map((ecl) => ({
    id: ecl.unique_id,
    reportingMonth: ecl.reporting_month,
    reportingYear: ecl.reporting_year,
    loanSector: ecl.loan_sector,
    stage1: ecl.stage_1_ecl,
    stage2: ecl.stage_2_ecl,
    stage3: ecl.stage_3_ecl,
    registeredBy: ecl.registed_by,
    get registeredOn() {
      const dbDate = new Date(ecl.registed_on).toString();
      return dbDate.split('G')[0];
    },
  }));

const otherAssetsList = (fetchData) =>
  fetchData.map((ofa) => ({
    id: ofa.unique_id,
    reportingMonth: ofa.reporting_month,
    reportingYear: ofa.reporting_year,
    loanSector: ofa.loan_type,
    ecl: ofa.ecl,
    registeredBy: ofa.registed_by,
    get registeredOn() {
      const dbDate = new Date(ofa.registed_on).toString();
      return dbDate.split('G')[0];
    },
  }));

const cureRateList = (fetchData) =>
  fetchData.map((cr) => ({
    id: cr.unique_id,
    reportingMonth: cr.reporting_month,
    reportingYear: cr.reporting_year,
    loanSector: cr.loan_sector,
    totalNumAccounts: cr.total_number_of_accounts,
    totalDefAccounts: cr.number_of_defaulted_accounts,
    totalNumCuredAccounts: cr.number_of_cured_accounts,
    totalAmountCuredAccounts: cr.total_cured_amounts,
    totalExposureIOD: cr.total_exposure_at_iod,
    cureRate: cr.cure_rate * 100,
    registeredBy: cr.registed_by,
    get registeredOn() {
      const dbDate = new Date(cr.registed_on).toString();
      return dbDate.split('G')[0];
    },
  }));

const collectionLGDList = (fetchData) =>
  fetchData.map((coll) => ({
    id: coll.unique_id,
    reportingMonth: coll.reporting_month,
    reportingYear: coll.reporting_year,
    loanSector: coll.loan_sector,
    weightedRR: coll.weighted_rr * 100,
    cureRate: coll.cure_rate * 100,
    collLGD: coll.coll_lgd * 100,
    registeredBy: coll.registed_by,
    get registeredOn() {
      const dbDate = new Date(coll.registed_on).toString();
      return dbDate.split('G')[0];
    },
  }));

const macroCCFList = (fetchData) =>
  fetchData.map((ecl) => ({
    id: ecl.unique_id,
    reportingMonth: ecl.reporting_month,
    reportingYear: ecl.reporting_year,
    loanSector: ecl.loan_sector,
    mepe1: ecl.mepe_1,
    mepe2: ecl.mepe_2,
    mepe3: ecl.mepe_3,
    ccf: ecl.ccf * 100,
    registeredBy: ecl.registed_by,
    get registeredOn() {
      const dbDate = new Date(ecl.registed_on).toString();
      return dbDate.split('G')[0];
    },
  }));

const fetchAnnualReport = (setLoading, setREPORTLIST, fetchLink, reportCode) => {
  axiosInstance
    .get(fetchLink)
    .then((res) => {
      let REPORTLIST = [];
      if (reportCode === 'TL') {
        REPORTLIST = termLoansList(res.data);
      } else if (reportCode === 'OFA') {
        REPORTLIST = otherAssetsList(res.data);
      } else if (reportCode === 'CR') {
        REPORTLIST = cureRateList(res.data);
      } else if (reportCode === 'Coll_LDG') {
        REPORTLIST = collectionLGDList(res.data);
      } else if (reportCode === 'Macro_CCF') {
        REPORTLIST = macroCCFList(res.data);
      }
      setLoading(false);
      setREPORTLIST(REPORTLIST);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      setREPORTLIST([]);
    });
};

export default fetchAnnualReport;
