import { useEffect } from 'react';

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
  InputAdornment,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { FormProvider, RHFTextField } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';

// ----------------------------------------------------------------------

export default function CompanyInfoUpdate({ companyInfo, open, setOpen, refresh }) {
  const getDefaultValues = () => {
    return {
      phone: companyInfo.phone_number,
      email: companyInfo.email,
    };
  };

  const UpdateSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
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

    const postData = {
      name: companyInfo.name,
      email: formData.email,
      phone_number: formData.phone,
    };

    axiosInstance
      .patch('users/api/institute-info/', postData, null)
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Information</DialogTitle>
      <DialogContent>
        <DialogContentText>Change institute information.</DialogContentText>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
          <Stack spacing={2} sx={{ m: { xs: 0, sm: 4 } }}>
            <Typography variant="subtitle1" gutterBottom>
              Enter institute detail information
            </Typography>

            <RHFTextField name="email" label="Email address" />
            <RHFTextField
              name="phone"
              label="Phone number"
              InputProps={{
                startAdornment: <InputAdornment position="start">+251</InputAdornment>,
              }}
            />
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Update Info
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
