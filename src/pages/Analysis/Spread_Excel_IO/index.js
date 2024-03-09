import  React from 'react';
// import GC from '@grapecity/spread-sheets';
// import '@grapecity/spread-sheets-charts';
import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import { IO } from '@grapecity/spread-excelio';
import { saveAs } from 'file-saver';
import { jsonData } from './data';
import './styles.css';

const Component = React.Component;

// window.GC = GC;

function _getElementById(id) {
  return document.getElementById(id);
}

export default class ExcelIO extends Component {
  constructor(props) {
    super(props);
    this.spread = null;
    this.importExcelFile = null;
    this.exportFileName = 'export.xlsx';
    this.incrmentalChange = '';
    this.password = '';
  }

  initSpread(spread) {
    this.spread = spread;
    spread.options.calcOnDemand = true;
    spread.fromJSON(jsonData);
  }

  changeFileDemo(e) {
    this.importExcelFile = e.target.files[0];
  }

  changePassword(e) {
    this.password = e.target.value;
  }

  changeExportFileName(e) {
    this.exportFileName = e.target.value;
  }

  changeIncremental(e) {
    this.incrmentalChange = 'e.target.value';
    _getElementById('loading-container').style.display = e.target.checked ? 'block' : 'none';
  }

  loadExcel(e) {
    const spread = this.spread;
    const excelIo = new IO();
    const excelFile = this.importExcelFile;
    const password = this.password;

    const incrementalEle = _getElementById('incremental');
    const loadingStatus = _getElementById('loadingStatus');
    // here is excel IO API

    console.log(this.incrmentalChange);
    excelIo.open(
      excelFile,
      (json) => {
        const workbookObj = json;
        if (incrementalEle.checked) {
          spread.fromJSON(workbookObj, {
            incrementalLoading: {
              loading: (progress, args) => {
                progress *= 100;
                loadingStatus.value = progress;
                console.log('current loading sheet', args.sheet && args.sheet.name());
              },
              loaded: () => {},
            },
          });
        } else {
          spread.fromJSON(workbookObj);
        }
      },
      (e) => {
        // process error
        alert(e.errorMessage);
      },
      { password }
    );
  }

  saveExcel(e) {
    const spread = this.spread;
    const excelIo = new IO();

    let fileName = this.exportFileName;
    const password = this.password;
    if (fileName.substr(-5, 5) !== '.xlsx') {
      fileName += '.xlsx';
    }

    const json = spread.toJSON();

    // here is excel IO API
    excelIo.save(
      json,
      (blob) => {
        saveAs(blob, fileName);
      },
      (e) => {
        // process error
        console.log(e);
      },
      { password }
    );
  }

  render() {
    return (
      <div className="sample-tutorial">
        <div className="sample-spreadsheets">
          <SpreadSheets workbookInitialized={(spread) => this.initSpread(spread)}>
            <Worksheet />
          </SpreadSheets>
        </div>
        <div className="options-container">
          <div className="option-row">
            <div className="inputContainer">
              <label htmlFor="incremental">
                Incremental Loading
                <input type="checkbox" id="incremental" onChange={(e) => this.changeIncremental(e)} defaultChecked />
              </label>

              <p className="summary" id="loading-container">
                Loading progress:
                <input
                  style={{ width: '231px' }}
                  id="loadingStatus"
                  type="range"
                  name="points"
                  min="0"
                  max="100"
                  value="0"
                  step="0.01"
                />
              </p>
              <input type="file" id="fileDemo" className="input" onChange={(e) => this.changeFileDemo(e)} />
              <br />
              <input
                type="button"
                id="loadExcel"
                defaultValue="import"
                className="button"
                onClick={(e) => this.loadExcel(e)}
              />
            </div>
            <div className="inputContainer">
              <input
                id="exportFileName"
                defaultValue="export.xlsx"
                className="input"
                onChange={(e) => this.changeExportFileName(e)}
              />
              <input
                type="button"
                id="saveExcel"
                defaultValue="export"
                className="button"
                onClick={(e) => this.saveExcel(e)}
              />
            </div>
          </div>
          <div className="option-row">
            <div className="group">
              <label htmlFor="passward">
                Password:
                <input type="password" id="password" onChange={(e) => this.changePassword(e)} />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
