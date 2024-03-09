// Excel -JSON Handlers
import { read, utils, writeFileXLSX } from 'xlsx';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import fileDownload from 'js-file-download';

// Local modules
import { axiosInstance } from '../utils/axios';
import { openWebSocket } from './open-web-socket';

export const handleFLIAnalysis = (e, impValues, setMacroProcess, setTaskIdFLI) => {
  e.preventDefault();

  const { date, isSave, userId, inputData } = impValues;
  const originPathname = window.location.pathname.split('/')[3];

  openWebSocket(userId, setMacroProcess);

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const postData = new FormData();
  postData.append('Analysis_Date', new Date().toISOString());
  postData.append('Reporting_Date', date.toISOString());
  postData.append('Base_Scenario', e.target.elements.baseCase.value);
  postData.append('Downside_Scenario', e.target.elements.downsideCase.value);
  postData.append('Upside_Scenario', e.target.elements.upsideCase.value);
  postData.append('FLI_Min', e.target.elements.minFLI.value);
  postData.append('FLI_Max', e.target.elements.maxFLI.value);
  postData.append('Uploaded_File', e.target.elements.uploadedFile.files[0]);
  postData.append('Save_to_Server', isSave);
  postData.append('Operation_type', originPathname);
  postData.append('Input_JSON', JSON.stringify(inputData));

  axiosInstance
    .post('macro-ccf-analysis/api/analyze-macro-ccf', postData, config)
    .then((res) => {
      setTaskIdFLI(res.data);
    })
    .catch((error) => console.log(error));
};

export const handleOrganization = (e, impValues, setPdProcess, setTaskIdPD) => {
  e.preventDefault();

  const { date, userId, inputData } = impValues;
  const originPathname = window.location.pathname.split('/')[3];

  openWebSocket(userId, setPdProcess);

  const filesList = e.target.elements.uploadedFile.files;
  const fileQueue = {};

  Object.keys(filesList).map((key) => {
    if (filesList[key].name.split('.').pop() === 'xlsx') {
      fileQueue.Excel = filesList[key];
    }
    if (filesList[key].name.split('.').pop() === 'gzip') {
      fileQueue.Parquet = filesList[key];
    }
    return fileQueue;
  });

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  const postData = new FormData();
  postData.append('Analysis_Date', new Date().toISOString());
  postData.append('Last_Date', date.toISOString());
  postData.append('Months_to_Add', e.target.elements.monthsToAppend.value);
  postData.append('Upload_Excel', fileQueue.Excel);
  postData.append('Upload_Parquet', fileQueue.Parquet);
  postData.append('Operation_type', originPathname);
  postData.append('Input_JSON', JSON.stringify(inputData));

  axiosInstance
    .post('pd-input-data-organizer/api/orginize-pd', postData, config)
    .then((res) => {
      setTaskIdPD(res.data);
    })
    .catch((error) => console.log(error));
};

export const handleECLAnalysis = (e, impValues, setEclProcess, setTaskIdECL) => {
  e.preventDefault();

  const { date, isSave, userId, inputData } = impValues;
  const originPathname = window.location.pathname.split('/')[3];

  openWebSocket(userId, setEclProcess);

  const filesList = e.target.elements.uploadedFile.files;
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
  postData.append('Analysis_Date', new Date().toISOString());
  postData.append('Reporting_Date', date.toISOString());
  postData.append('Min_LGD', e.target.elements.minLGD.value);
  postData.append('Min_PD', e.target.elements.minPD.value);
  postData.append('Other_Assets_CCF', e.target.elements.otherAssetsCCCF.value);
  postData.append('Month_to_Impair', e.target.elements.impairmentStartMonth.value);
  postData.append('Upload_Excel', fileQueue.Excel);
  postData.append('Upload_Parquet', fileQueue.Parquet);
  postData.append('Save_to_Server', isSave);
  postData.append('Operation_type', originPathname);
  postData.append('Input_JSON', JSON.stringify(inputData));

  axiosInstance
    .post('ecl-analysis/api/analyze-ecl', postData, config)
    .then((res) => {
      setTaskIdECL(res.data);
    })
    .catch((error) => console.log(error));
};

export const excelToJSON = async (excelFile, setReadProgress) => {
  // setReadProgress({ ...readProgress, progress: 0 });

  const convertedJSONDate = [];

  const inputFile = await excelFile.arrayBuffer();
  const workBook = read(inputFile);
  const workBookSheetNameList = workBook.SheetNames;

  workBookSheetNameList.map((sheetName) => {
    const workSheetToJSON = utils.sheet_to_json(workBook.Sheets[sheetName], { defval: null });

    convertedJSONDate.push({
      sheetName,
      workSheetToJSON,
    });

    return sheetName;
  });

  setReadProgress({ macroInputJSON: convertedJSONDate, isFinished: true });
  console.log(convertedJSONDate);
  // downloadExcel1(convertedJSONDate);
};

export const downloadExcel = (downloadExcelAPI, downloadProps) => {
  const { setAnalysisProgress, analysisCode, outputFilename } = downloadProps;
  setAnalysisProgress({
    analysisCode,
    stage: 500,
    title: 'Converting Result to Excel...',
    status: 'success',
    total: 12,
  });

  axiosInstance
    .get(downloadExcelAPI)
    .then((res) => {
      const workBook = utils.book_new();

      res.data.map((sheetJSON) => {
        const workSheet = utils.json_to_sheet(sheetJSON.workSheetToJSON);
        utils.book_append_sheet(workBook, workSheet, sheetJSON.sheetName);

        return sheetJSON.sheetName;
      });

      writeFileXLSX(workBook, outputFilename);

      setAnalysisProgress({
        analysisCode,
        stage: 600,
        title: 'The Excel Result Downloaded!',
        status: 'success',
        total: 12,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const downloadParquet = (downloadParquetAPI, setAnalysisProgress) => {
  setAnalysisProgress({
    analysisCode: 'PD Progress',
    stage: 700,
    title: 'Converting Result to Parquet...',
    status: 'success',
    total: 12,
  });

  axiosInstance
    .get(downloadParquetAPI, {
      responseType: 'blob',
    })
    .then((res) => {
      fileDownload(res.data, 'PD Updated Output.parquet.gzip');
      console.log('The Parquet File Downloaded!');
      setAnalysisProgress({
        analysisCode: 'PD Progress',
        stage: 1000,
        title: 'The Parquet File Downloaded!',
        status: 'success',
        total: 12,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const downloadExcel1 = (jsonResult) => {
  console.log(jsonResult);
  const workBook = utils.book_new();

  jsonResult.map((sheetJSON) => {
    const workSheet = utils.json_to_sheet(sheetJSON.workSheetToJSON);
    utils.book_append_sheet(workBook, workSheet, sheetJSON.sheetName);

    return sheetJSON.sheetName;
  });
  writeFileXLSX(workBook, 'SheetJSReactExcelIO.xlsx');
};

export const styledExcelDownload = (sheetJSON) => {
  const workbook = new Workbook();

  const dataForExcel = [];
  sheetJSON.workSheetToJSON.map((row) => dataForExcel.push(Object.values(row)));

  const worksheet = workbook.addWorksheet(sheetJSON.sheetName);

  // Adding Header Row
  const headerRow = worksheet.addRow(Object.keys(sheetJSON.workSheetToJSON[0]));

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' },
      bgColor: { argb: '' },
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 24,
      width: 100,
    };
  });
  // Adding Data
  worksheet.addRows(dataForExcel);

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'title.xlsx');
  });
};
