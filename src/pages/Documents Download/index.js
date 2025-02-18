import { useState, useEffect } from 'react';

// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// material
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Tooltip,
  Button,
  Popover,
  TableCell,
  Typography,
  Chip,
  Divider,
  tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { LoadingButton } from '@mui/lab';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddCommentIcon from '@mui/icons-material/AddComment';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// context and modules
import { axiosInstance } from 'utils/axios';

import { FormProvider, RHFTextField } from 'components/hook-form';

// custom style
const ApprovalTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    whiteSpace: 'nowrap',
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    borderRightWidth: '1px',
  },
}));

const ChangeStatusButton = styled(Button)(({ theme }) => ({
  paddingTop: 2,
  paddingBottom: 2,
  paddingInline: 8,
  marginLeft: 4,
  minWidth: 0,
}));

// ---------------------------------------------------------- Result Approval -----------------------------------------------------
export const ResultApproveCell = ({ id, isApproved, setRefreshTime, approveAPI, deleteCode }) => {
  const resultApprovalFlag = (truth) => {
    if (truth === 'Yes') {
      return <Chip color="success" variant="outlined" size="small" label={truth} sx={{ px: 2, borderRadius: 1 }} />;
    }
    return <Chip color="error" variant="outlined" size="small" label={truth} sx={{ px: 2, borderRadius: 1 }} />;
  };

  const handleChangeApprovalStatus = async () => {
    const payload = { id, result_approved: isApproved !== 'Yes' };

    axiosInstance
      .patch(approveAPI, payload, null)
      .then(() => {
        setRefreshTime(Date.now());
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteAnalysis = async () => {
    let deleteAPI = '';
    if (deleteCode === 'ECL') {
      deleteAPI = `/ecl-analysis/api/${id}/delete`;
    } else if (deleteCode === 'PD') {
      deleteAPI = `/pd-input-data-organizer/api/${id}/delete`;
    } else {
      deleteAPI = `/macro-ccf-analysis/api/${id}/delete`;
    }

    axiosInstance
      .delete(deleteAPI)
      .then(() => {
        setRefreshTime(Date.now());
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorDelEl, setAnchorDelEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (event) => {
    setAnchorDelEl(event.currentTarget);
  };

  const handleDeleteClose = () => {
    setAnchorDelEl(null);
  };

  const open = Boolean(anchorEl);
  const delOpen = Boolean(anchorDelEl);

  const popID = open ? 'confirm-change-status' : undefined;
  const delPopID = delOpen ? 'confirm-delete-analysis' : undefined;

  return (
    <ApprovalTableCell>
      <>{resultApprovalFlag(isApproved)}</>

      <Tooltip title="Change approval status">
        <ChangeStatusButton aria-describedby={popID} color="warning" size="small" variant="contained">
          <SwapVertIcon onClick={handleClick} fontSize="small" />
        </ChangeStatusButton>
      </Tooltip>
      <Tooltip title="Delete analysis">
        <ChangeStatusButton aria-describedby={popID} color="error" size="small" variant="contained">
          <DeleteForeverIcon onClick={handleDeleteClick} fontSize="small" />
        </ChangeStatusButton>
      </Tooltip>
      <Popover
        id={popID}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 1 }} onClick={handleChangeApprovalStatus}>
          <Button size="small" variant="contained" color="warning">
            Chance Status?
          </Button>
        </Typography>
      </Popover>
      <Popover
        id={delPopID}
        open={delOpen}
        onClose={handleDeleteClose}
        anchorEl={anchorDelEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 1 }} onClick={handleDeleteAnalysis}>
          <Button size="small" variant="contained" color="error">
            Are you sure, Delete?
          </Button>
        </Typography>
      </Popover>
    </ApprovalTableCell>
  );
};

// ---------------------------------------------------------- Result Remark -----------------------------------------------------

export const ResultRemarkCell = ({ id, isApproved, remark, setRefreshTime, approveAPI }) => {
  const [openRemarkForm, setOpenRemarkForm] = useState(false);

  const getDefaultValues = () => {
    return {
      remark: remark || '',
    };
  };

  const remarkSchema = Yup.object().shape({
    remark: Yup.string().required('Please write remark on the result'),
  });

  const methods = useForm({
    resolver: yupResolver(remarkSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => methods.reset(getDefaultValues()), [openRemarkForm]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const formData = methods.getValues();
    const payload = { id, result_approved: isApproved === 'Yes', remark_on_result: formData.remark };

    axiosInstance
      .patch(approveAPI, payload, null)
      .then(() => {
        setRefreshTime(Date.now());
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    setOpenRemarkForm(false);
  };

  const handleOpen = () => {
    setOpenRemarkForm(true);
  };

  return (
    <>
      <Dialog fullWidth open={openRemarkForm} onClose={handleClose}>
        <DialogTitle>Remark on Result</DialogTitle>
        <DialogContent>
          <DialogContentText>Write remark on the result</DialogContentText>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />

              <RHFTextField multiline rows={10} name="remark" label="Remark" />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
                Update Remark
              </LoadingButton>
            </Stack>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <ApprovalTableCell align="center">
        <Button color="info" onClick={handleOpen}>
          {remark ? (
            <Tooltip title="Read/Update remark">
              <AutoStoriesIcon color="action" fontSize="large" />
            </Tooltip>
          ) : (
            <Tooltip title="Write remark">
              <AddCommentIcon color="action" fontSize="large" />
            </Tooltip>
          )}
        </Button>
      </ApprovalTableCell>
    </>
  );
};

export { default as MacroCCFDocs } from './Macro_CCF';
export { default as PDorgDocs } from './PD_InputData_Prep';
export { default as ECLAnalysisDocs } from './ECLAnalysis';
