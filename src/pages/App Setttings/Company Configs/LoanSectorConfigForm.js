import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { FormProvider, RHFTextField } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';
import { isObjectNotEmpty } from 'utils';
import { useGlobalContext } from 'contexts/AppContext';

// ----------------------------------------------------------------------

export default function LoanSectorConfigForm({ open, setOpen, loanSectorConfigs, refresh }) {
  const isEditForm = isObjectNotEmpty(loanSectorConfigs);

  const getDefaultValues = () => {
    return {
      key: loanSectorConfigs.key || '',
      label: loanSectorConfigs.label || '',
      description: loanSectorConfigs.description || '',
    };
  };

  const UpdateSchema = Yup.object().shape({
    key: Yup.string().required('Key for loan sector is required'),
    label: Yup.string().required('Label/Name for the loan sector required'),
    description: Yup.string().required('Please write description the loan sector'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => methods.reset(getDefaultValues()), [open]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const formData = methods.getValues();

    const loanSector = {
      key: formData.key,
      label: formData.label,
      old_key: loanSectorConfigs.key || '',
      description: formData.description,
    };

    axiosInstance
      .patch('users/api/update-institute-configs/', loanSector, null)
      .then(() => {
        handleClose();
        refresh(Date.now());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{isEditForm ? 'Update' : 'Add'} Loan Sector</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isEditForm ? 'Change loan sector information.' : 'Create new Loan sector'}
        </DialogContentText>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Enter information about the loan sector
            </Typography>

            <RHFTextField name="key" label="Key/Code" />
            <RHFTextField name="label" label="Label/Name" />
            <RHFTextField multiline rows={4} name="description" label="Description" />
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              {isEditForm ? 'Update Loan Sector' : 'Add Loan Sector'}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
