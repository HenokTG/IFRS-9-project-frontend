import { axiosInstance } from 'utils/axios';

// ----------------------------------------------------------------------

export const summaryList = [
  { id: 1, title: 'Term Loan Stage 1 Total', total: 0, color: 'success', icon: 'icon-park-outline:good-two' },
  { id: 2, title: 'Term Loan Stage 2 Total', total: 0, color: 'warning', icon: 'ri:emotion-normal-line' },
  { id: 3, title: 'Term Loan Stage 3 Total', total: 0, color: 'error', icon: 'icon-park-outline:bad-two' },
  { id: 4, title: 'Term Loan Total', total: 0, color: 'primary', icon: 'fluent-mdl2:total' },
  {
    id: 5,
    title: 'Other Financial Assets Total',
    total: 0,
    color: 'info',
    icon: 'material-symbols:add-comment-outline',
  },
];

export const fetchDashboardSummary = (summaryAPI, filterData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(summaryAPI, filterData)
      .then((res) => {
        const newSummaryList = res.data.map((total, idx) => {
          return { ...summaryList[idx], total };
        });

        resolve({
          summary: newSummaryList,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchDashboardTLDataset = (termLoanAPI, filterData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(termLoanAPI, filterData)
      .then((res) => {
        const termLoanDataset = [res.data.stage1, res.data.stage2, res.data.stage3, res.data.sector];

        resolve({
          termLoanDataset,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const donutPartBgColor = [
  '#EC712F',
  '#2FECCD',
  '#2F4CEC',
  '#D47FBB',
  '#468AFD',
  '#46FD90',
  '#FD46D9',
  '#46CEFD',
  '#3F51B5',
  '#46FDB9',
  '#46CEFD',
  '#46FDD1',
  '#6A4C82',
  '#3F51B5',
  '#46FDD1',
  '#FDD146',
  '#BAEC93',
  '#B8FD46',
  '#6A46FD',
  '#46FDD1',
  '#3F51B5',
  '#9046FD',
  '#D2FD46',
  '#C9ADD9',
  '#FDC746',
];

export const fetchDashboardOFADataset = (otherAssetsAPI, filterData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(otherAssetsAPI, filterData)
      .then((res) => {
        let others = 0;
        const colorList = [];
        const loanTypes = [];
        const eclList = [];
        const loanTitles = [];

        res.data.map((loanType, idx) => {
          loanTypes.push({
            title: loanType.type,
            value: loanType.value.toFixed(2),
            color: donutPartBgColor[idx],
          });

          if (loanType.value >= 1000000) {
            eclList.push(loanType.value.toFixed(2));
            loanTitles.push(loanType.type);
            colorList.push(donutPartBgColor[idx]);
          } else {
            others += loanType.value;
          }

          return idx;
        });

        if (others !== 0) {
          eclList.push(others.toFixed(2));
          loanTitles.push('All Others');
          colorList.push('#B5D47F');
        }

        const otherAssetsDataset = [loanTitles, eclList, colorList, loanTypes];

        resolve({
          otherAssetsDataset,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
