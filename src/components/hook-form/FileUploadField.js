import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTheme } from '@mui/material/styles';
import { Box, FormControl, Icon, IconButton, Typography } from '@mui/material';

import { MdClose } from 'react-icons/md';
import { PiFilesFill } from 'react-icons/pi';
import { CgFileRemove } from 'react-icons/cg';

import { returnStringDate, returnFileSizes, getFileIcon } from '../../utils';

// ==============================================  UploadFile Component  ==============================================

const UploadFile = ({ setFilesList, maxFiles }) => {
  const theme = useTheme();

  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.apache.parquet': ['.parquet'],
    },
    maxFiles,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setFilesList(acceptedFiles);
    },
  });

  function handleRemove(e, fileName) {
    e.stopPropagation();

    const filteredFiles = files.filter((file) => file.name !== fileName);
    const formFiles = filteredFiles.length > 0 ? filteredFiles : [];
    setFiles(filteredFiles);
    setFilesList(formFiles);
  }

  function handleClear(e) {
    e.stopPropagation();

    setFiles([]);
    setFilesList([]);
  }

  const canFieldUpload = isDragActive || files.length === 0;
  const fieldRootProps = canFieldUpload ? { ...getRootProps() } : {};

  let borderColor = theme.palette.primary.main;
  if (isDragActive) {
    borderColor = theme.palette.success.light;
  }

  return (
    <Box component="section" sx={{ p: 2, cursor: canFieldUpload ? 'pointer' : 'default' }}>
      <FormControl fullWidth>
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          borderRadius="7px"
          minHeight="120px"
          width="100%"
          sx={{ p: '5px', border: `1px solid ${borderColor}` }}
          {...fieldRootProps}
        >
          {files.length > 0 && (
            <>
              <Box
                position="absolute"
                top="0px"
                right="0px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
              >
                <Box
                  position="absolute"
                  top="15px"
                  right="15px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="30px"
                  height="30px"
                  borderRadius="100%"
                  sx={{ cursor: 'pointer', color: 'red', border: '1px solid red' }}
                  onClick={(e) => handleClear(e)}
                >
                  <MdClose />
                </Box>
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                gap={'8px'}
                paddingX={{ xs: 1, sm: 4, lg: 12 }}
                paddingTop={6}
                paddingBottom={2}
                width="100%"
              >
                {files.map((file) => (
                  <Box
                    key={file.name}
                    display="flex"
                    alignItems="center"
                    width="100%"
                    columnGap={{ xs: 1, sm: 2 }}
                    sx={{
                      pb: 1,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Box display="flex" justifyContent="flex-start">
                      <Icon as={getFileIcon(file)} sx={{ fontSize: 32 }} color="action" />
                    </Box>
                    <Box key={file.name} display="flex" flexDirection="column" alignItems="center" width="100%">
                      <Typography width="100%" variant="body2" sx={{ fontWeight: 500 }}>
                        {file.name}
                      </Typography>
                      <Box display="flex" alignItems="center" width="100%">
                        <Box flex="6">
                          <Typography variant="caption">{returnStringDate(file.lastModifiedDate)}</Typography>
                        </Box>
                        <Box flex="3">
                          <Typography variant="caption">{returnFileSizes(file.size)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton onClick={(e) => handleRemove(e, file.name)} color="warning" size="large">
                      <CgFileRemove />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </>
          )}
          {!(files.length > 0) && isDragActive && (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" color="gray">
              <PiFilesFill fontSize={60} />
              <Typography color="secondary" align="center">
                Release to see selected files for analysis.
              </Typography>
            </Box>
          )}
          {!(files.length > 0 || isDragActive) && (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" color="gray">
              <input {...getInputProps()} required name="uploadedFile" />
              <PiFilesFill fontSize={60} />
              <Typography color="secondary" align="center">
                Drag and drop analysis files here or click to select.
              </Typography>
            </Box>
          )}
        </Box>
      </FormControl>
    </Box>
  );
};

export default UploadFile;
