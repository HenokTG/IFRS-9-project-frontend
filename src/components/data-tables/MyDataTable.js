import PropTypes, { object } from 'prop-types';

import { useState, useEffect } from 'react';

// material
import {
  Container,
  Icon,
  Card,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  Chip,
  TablePagination,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { FaFileExcel, FaFileContract } from 'react-icons/fa6';

// components
import Iconify from 'components/Iconify';
import Scrollbar from 'components/Scrollbar';
import TableToolbar from 'sections/data-table/TableToolbar';
import SearchNotFound from 'components/SearchNotFound';
import ListLoading from 'utils/helper-modules/listLoading';
import MyDataTableHeader from 'sections/data-table/MyDataTableHeader';

// locals
import fetchTableData, { fetchDocumentsInfo } from '_apiAxios/table-data-fetch';
import { fPercent, fCurrency } from 'utils/formatNumber';
import { openWebSocket } from '_apiAxios/open-web-socket';
import { downloadFile, downloadResult } from 'utils/axios';

// ----------------------------------------------------------------------

const BoxedTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    borderRightWidth: '1px',
  },
}));

const FileDownloadIcon = () => (
  <Iconify icon="mingcute:file-download-fill" width={40} height={40} style={{ color: '#806f6f' }} />
);

// ----------------------------------------------------------------------

MyDataTable.propTypes = {
  myTableTitle: PropTypes.string,
  tableHeader: PropTypes.arrayOf(object),
  apiLink: PropTypes.string,
  approveAPI: PropTypes.string,
  fetchCode: PropTypes.string,
  placeHl: PropTypes.string,
  isDocsFilter: PropTypes.bool,
  ResultApproveCell: PropTypes.oneOfType([PropTypes.node, PropTypes.any]),
  ResultRemarkCell: PropTypes.oneOfType([PropTypes.node, PropTypes.any]),
};

export default function MyDataTable({
  myTableTitle,
  tableHeader,
  apiLink,
  approveAPI,
  fetchCode,
  placeHl,
  isDocsFilter = false,
  ResultApproveCell,
  ResultRemarkCell,
}) {
  const [visilbeColumns, setVisilbeColumns] = useState(tableHeader);

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(null);
  const [filterObject, setFilterObject] = useState({});
  const [fetchLink, setFetchLink] = useState(apiLink);

  const [myData, setMyData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [order, setOrder] = useState('asc');
  const [sortBy, setSortBy] = useState(isDocsFilter ? 'analysis_date' : 'registered_on');
  const [orderBy, setOrderBy] = useState('analysisDate');

  const getFilesTableData = (query) => {
    const connectKey = fetchLink.includes('?') ? '&' : '?';
    const fetchLinkQuery = `${fetchLink}${connectKey}${query}`;

    fetchDocumentsInfo(fetchLinkQuery, fetchCode)
      .then(({ data, count, filtersAvailable }) => {
        setLoading(false);

        setMyData(data);
        setTotalCount(count);
        setFilterOptions(filtersAvailable);
      })
      .catch((error) => {
        setLoading(false);
        setMyData([]);
      });
  };

  const getSummaryTableData = (query) => {
    const fetchLinkQuery = `${apiLink}?${query}`;

    fetchTableData(fetchLinkQuery, fetchCode, filterObject)
      .then(({ data, count, filtersAvailable }) => {
        setLoading(false);

        setMyData(data);
        setTotalCount(count);
        setFilterOptions(filtersAvailable);
      })
      .catch((error) => {
        setLoading(false);
        setMyData([]);
      });
  };

  useEffect(
    () => {
      setLoading(true);

      const pagenateSortQuery = `sort_by=${sortBy}&page=${page + 1}&page_size=${rowsPerPage}`;
      if (isDocsFilter) {
        getFilesTableData(pagenateSortQuery);
      } else {
        getSummaryTableData(pagenateSortQuery);
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage, sortBy, filterObject, fetchLink, refreshTime]
  );

  const handleRequestSort = (event, headCell) => {
    const property = headCell.id;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    setSortBy(`${isAsc ? '-' : ''}${headCell.sortKey}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalCount) : 0;

  const dataNotFound = myData.length === 0;

  const [hoveredFile, setHoveredFile] = useState({});
  const [conversionTaskID, setConversionTaskId] = useState(null);
  const [conversionProcess, setConversionProcess] = useState({});

  const handleMouseEnter = (taskID, fileType, fileFor) => {
    setHoveredFile({ taskID, fileType, fileFor });
  };

  const isFileHovered = (taskID, fileType, fileFor) => {
    return hoveredFile.taskID === taskID && hoveredFile.fileType === fileType && hoveredFile.fileFor === fileFor;
  };

  useEffect(() => {
    if (conversionProcess.stage === 550) {
      setConversionTaskId(Number(conversionProcess.taskID));
    } else if (conversionProcess.stage === 575) {
      setRefreshTime(new Date());
      setConversionTaskId(null);
    } else {
      setConversionTaskId(null);
    }
  }, [conversionProcess]);

  const saveOnServerFlag = (truth) => {
    if (truth === 'Yes') {
      return <Chip color="success" variant="outlined" size="small" label={truth} sx={{ px: 2, borderRadius: 1 }} />;
    }
    return <Chip color="error" variant="outlined" size="small" label={truth} sx={{ px: 2, borderRadius: 1 }} />;
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ mx: 1 }}>
      <Stack direction="row" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          {myTableTitle}
        </Typography>
      </Stack>
      {loading ? (
        <ListLoading />
      ) : (
        <Card>
          <TableToolbar
            placeHl={placeHl}
            apiLink={apiLink}
            setPage={setPage}
            fetchLink={fetchLink}
            isDocsFilter={isDocsFilter}
            filterObject={filterObject}
            filterOptions={filterOptions}
            setFetchLink={setFetchLink}
            setRefreshTime={setRefreshTime}
            setFilterObject={setFilterObject}
            allColumns={tableHeader}
            visilbeColumns={visilbeColumns}
            setVisilbeColumns={setVisilbeColumns}
          />
          <Scrollbar>
            <Card sx={{ mx: 2, borderRadius: 1, overflow: 'auto' }}>
              <Table size="small">
                <MyDataTableHeader
                  order={order}
                  orderBy={orderBy}
                  headLabel={visilbeColumns}
                  onRequestSort={handleRequestSort}
                />
                <TableBody className="striped">
                  {myData.map((row) => {
                    return (
                      <TableRow hover key={row.id} tabIndex={-1}>
                        {visilbeColumns.map((header) => {
                          const key = header.id;
                          const isFile = header.type === 'file';
                          const isDate = header.type === 'date';
                          const isNumber = header.type === 'number';
                          const isBoolChip = header.type === 'bool';
                          const isCurrency = header.type === 'currency';
                          const isPercentile = header.type === 'percentile';

                          if (key === 'resultApproval')
                            return (
                              <ResultApproveCell
                                id={row.id}
                                key={row.id + key}
                                deleteCode={fetchCode}
                                approveAPI={approveAPI}
                                isApproved={row.resultApproval}
                                setRefreshTime={setRefreshTime}
                              />
                            );
                          if (key === 'resultRemark')
                            return (
                              <ResultRemarkCell
                                id={row.id}
                                key={row.id + key}
                                approveAPI={approveAPI}
                                remark={row.resultRemark}
                                isApproved={row.resultApproval}
                                setRefreshTime={setRefreshTime}
                              />
                            );

                          if (key === 'reportingMonth')
                            return (
                              <BoxedTableCell key={row.id + key} component="th" scope="row" padding="normal">
                                <Typography variant="subtitle2" noWrap>
                                  {row[key]}
                                </Typography>
                              </BoxedTableCell>
                            );
                          if (isDate || isNumber) {
                            return (
                              <BoxedTableCell key={row.id + key} align="right">
                                {row[key]}
                              </BoxedTableCell>
                            );
                          }
                          if (isCurrency) {
                            return (
                              <BoxedTableCell key={row.id + key} align="right">
                                {fCurrency(row[key])}
                              </BoxedTableCell>
                            );
                          }
                          if (isBoolChip) {
                            return (
                              <BoxedTableCell key={row.id + key} align="center">
                                {saveOnServerFlag(row[key])}
                              </BoxedTableCell>
                            );
                          }
                          if (isPercentile) {
                            return (
                              <BoxedTableCell key={row.id + key} align={row[key] === 0 ? 'center' : 'right'}>
                                {row[key] === 0 ? '-' : fPercent(row[key])}
                              </BoxedTableCell>
                            );
                          }
                          if (isFile) {
                            if (key === 'excelInput')
                              return (
                                <ExcelInputFile
                                  rowID={row.id}
                                  key={row.id + key}
                                  fileLink={row[key]}
                                  isHovered={isFileHovered}
                                  setIsHovered={setHoveredFile}
                                  handleHover={handleMouseEnter}
                                />
                              );
                            if (key === 'parquetInput')
                              return (
                                <ParquetInputFile
                                  rowID={row.id}
                                  key={row.id + key}
                                  fileLink={row[key]}
                                  isHovered={isFileHovered}
                                  setIsHovered={setHoveredFile}
                                  handleHover={handleMouseEnter}
                                />
                              );
                            if (key === 'excelResult')
                              return (
                                <ExcelResultFile
                                  rowID={row.id}
                                  key={row.id + key}
                                  fileOwner={row.profilePk}
                                  taskID={conversionTaskID}
                                  setConversionProcess={setConversionProcess}
                                  fileLink={row[key]}
                                  isHovered={isFileHovered}
                                  setIsHovered={setHoveredFile}
                                  handleHover={handleMouseEnter}
                                />
                              );
                            if (key === 'parquetResult')
                              return (
                                <ParquetResultFile
                                  rowID={row.id}
                                  key={row.id + key}
                                  fileLink={row[key]}
                                  isHovered={isFileHovered}
                                  setIsHovered={setHoveredFile}
                                  handleHover={handleMouseEnter}
                                />
                              );
                          }

                          return <BoxedTableCell key={row.id + key}>{row[key]}</BoxedTableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={visilbeColumns.length} />
                    </TableRow>
                  )}
                </TableBody>

                {dataNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={visilbeColumns.length} sx={{ py: 5 }}>
                        <SearchNotFound searchQuery="" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </Card>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </Container>
  );
}

const ExcelInputFile = ({ rowID, fileLink, isHovered, setIsHovered, handleHover }) => {
  return (
    <BoxedTableCell
      align="center"
      onClick={() => {
        downloadFile(fileLink);
      }}
      sx={{ cursor: 'pointer' }}
      onMouseEnter={() => {
        handleHover(rowID, 'excel', 'input');
      }}
      onMouseLeave={() => {
        setIsHovered({});
      }}
    >
      {isHovered(rowID, 'excel', 'input') ? (
        <FileDownloadIcon />
      ) : (
        <Icon as={FaFileExcel} sx={{ fontSize: 32 }} color="action" />
      )}
    </BoxedTableCell>
  );
};

const ParquetInputFile = ({ rowID, fileLink, isHovered, setIsHovered, handleHover }) => {
  return (
    <BoxedTableCell
      align="center"
      onClick={() => {
        if (fileLink) downloadFile(fileLink);
      }}
      sx={{ cursor: fileLink ? 'pointer' : 'auto' }}
      onMouseEnter={() => {
        handleHover(rowID, 'parquet', 'input');
      }}
      onMouseLeave={() => {
        setIsHovered({});
      }}
    >
      {fileLink ? (
        <>
          {isHovered(rowID, 'parquet', 'input') ? (
            <FileDownloadIcon />
          ) : (
            <Icon as={FaFileContract} sx={{ fontSize: 32 }} color="action" />
          )}
        </>
      ) : (
        '-'
      )}
    </BoxedTableCell>
  );
};

const ExcelResultFile = ({
  rowID,
  fileOwner,
  taskID,
  fileLink,
  isHovered,
  setIsHovered,
  handleHover,
  setConversionProcess,
}) => {
  const downLoadExcelResult = (taskID, fileOwner) => {
    const excelResultAPI = `pd-input-data-organizer/api/download-pd-excel/${fileOwner}/${taskID}`;

    openWebSocket(fileOwner, setConversionProcess);
    downloadResult(excelResultAPI);
  };

  return (
    <BoxedTableCell
      align="center"
      onClick={() => {
        if (fileLink) downloadFile(fileLink);
        else {
          downLoadExcelResult(rowID, fileOwner);
        }
      }}
      sx={{ cursor: 'pointer' }}
      onMouseEnter={() => {
        handleHover(rowID, 'excel', 'result');
      }}
      onMouseLeave={() => {
        setIsHovered({});
      }}
    >
      {taskID === Number(rowID) ? (
        <Iconify icon="line-md:downloading-loop" width={36} height={36} style={{ color: '#1890FF' }} />
      ) : (
        <>
          {isHovered(rowID, 'excel', 'result') ? (
            <>
              {fileLink ? (
                <FileDownloadIcon />
              ) : (
                <Iconify
                  icon="fluent:clock-arrow-download-24-regular"
                  style={{ color: '#f08c2d' }}
                  width={36}
                  height={36}
                />
              )}
            </>
          ) : (
            <Icon as={FaFileExcel} sx={{ fontSize: 32 }} color="action" />
          )}
        </>
      )}
    </BoxedTableCell>
  );
};

const ParquetResultFile = ({ rowID, fileLink, isHovered, setIsHovered, handleHover }) => {
  return (
    <BoxedTableCell
      align="center"
      onClick={() => {
        downloadFile(fileLink);
      }}
      sx={{ cursor: 'pointer' }}
      onMouseEnter={() => {
        handleHover(rowID, 'parquet', 'result');
      }}
      onMouseLeave={() => {
        setIsHovered({});
      }}
    >
      {isHovered(rowID, 'parquet', 'result') ? (
        <FileDownloadIcon />
      ) : (
        <Icon as={FaFileContract} sx={{ fontSize: 32 }} color="action" />
      )}
    </BoxedTableCell>
  );
};
