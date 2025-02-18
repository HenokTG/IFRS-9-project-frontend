// Local modules
import { axiosInstance } from 'utils/axios';

export const handleFLIAnalysis = (e, impValues) => {
  e.preventDefault();

  const { date, isSave, filesList } = impValues;

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  const postData = new FormData();

  postData.append('save_to_server', isSave);
  postData.append('upload_excel', filesList[0]);
  postData.append('reporting_date', date.toISOString());
  postData.append('analysis_date', new Date().toISOString());
  postData.append('base_scenario', e.target.elements.baseCase.value);
  postData.append('upside_scenario', e.target.elements.upsideCase.value);
  postData.append('downside_scenario', e.target.elements.downsideCase.value);

  axiosInstance
    .post('macro-ccf-analysis/api/analyze-macro-ccf', postData, config)
    .then((res) => {
      console.log(`FLI and CCF Analysis with task ID: ${res?.data} is created`);
    })
    .catch((error) => console.log(error));
};

export const handleOrganization = (e, impValues) => {
  e.preventDefault();

  const { date, filesList } = impValues;

  const fileQueue = {};

  Object.keys(filesList).map((key) => {
    if (filesList[key].name.split('.').pop() === 'xlsx') {
      fileQueue.Excel = filesList[key];
    }
    if (filesList[key].name.split('.').pop() === 'parquet') {
      fileQueue.Parquet = filesList[key];
    }
    return fileQueue;
  });

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  const postData = new FormData();

  postData.append('reporting_date', date.toISOString());
  postData.append('upload_excel', fileQueue.Excel);
  postData.append('upload_parquet', fileQueue.Parquet);
  postData.append('analysis_date', new Date().toISOString());
  postData.append('months_to_add', e.target.elements.monthsToAppend.value);

  axiosInstance
    .post('pd-input-data-organizer/api/orginize-pd', postData, config)
    .then((res) => {
      console.log(`PD Prep with task ID: ${res?.data} is created`);
    })
    .catch((error) => console.log(error));
};

export const handleECLAnalysis = (e, impValues) => {
  e.preventDefault();

  const { date, isSave, filesList } = impValues;

  const fileQueue = {};

  Object.keys(filesList).map((key) => {
    if (filesList[key].name.split('.').pop() === 'xlsx') {
      fileQueue.Excel = filesList[key];
    }
    if (filesList[key].name.split('.').pop() === 'parquet') {
      fileQueue.Parquet = filesList[key];
    }
    return fileQueue;
  });

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  const postData = new FormData();

  postData.append('save_to_server', isSave);
  postData.append('upload_excel', fileQueue.Excel);
  postData.append('upload_parquet', fileQueue.Parquet);
  postData.append('reporting_date', date.toISOString());
  postData.append('analysis_date', new Date().toISOString());
  postData.append('min_PD', e.target.elements.minPD.value);
  postData.append('min_LGD', e.target.elements.minLGD.value);
  postData.append('other_assets_CCF', e.target.elements.otherAssetsCCCF.value);
  postData.append('month_to_impair', e.target.elements.impairmentStartMonth.value);

  axiosInstance
    .post('ecl-analysis/api/analyze-ecl', postData, config)
    .then((res) => {
      console.log(`ECL Analysis with task ID: ${res?.data} is created`);
    })
    .catch((error) => console.log(error));
};
