import moment from 'moment';

import { FaFileWord, FaFileImage, FaFileExcel, FaFileCsv, FaFilePdf, FaFileContract } from 'react-icons/fa6';

// ================================================= Helper modules ================================================
export const isObjectNotEmpty = (objectName) => {
  return !(objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object);
};

export const returnStringDate = (date) => moment(date).format('MMMM DD, YYYY');

export const returnFileSizes = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export const getFileIcon = (file) => {
  const fileName = file.name ?? file.file_name;
  const fileExtension = fileName.split('.').pop();

  switch (fileExtension) {
    case 'pdf':
      return FaFilePdf;
    case 'doc':
    case 'docx':
      return FaFileWord;
    case 'xls':
    case 'xlsx':
      return FaFileExcel;
    case 'csv':
      return FaFileCsv;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return FaFileImage;
    default:
      return FaFileContract;
  }
};
