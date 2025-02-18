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
import fetchAccount from '_apiAxios/account';
import { axiosInstance } from 'utils/axios';
import { useGlobalContext } from 'contexts/AppContext';

// ----------------------------------------------------------------------

export default function UserProfileUpdate({ open, setOpen }) {
  const { profile, setProfile } = useGlobalContext();

  const getDefaultValues = () => {
    return {
      phone: profile.phone_number,
      firstName: profile.firstName,
      lastName: profile.lastName,
      department: profile.dept,
      jobTitle: profile.jobTitle,
    };
  };

  const UpdateSchema = Yup.object().shape({
    phone: Yup.string().required('Phone number is required'),
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    department: Yup.string().required('Please enter the department your are working in'),
    jobTitle: Yup.string().required('Please enter the official job title you are assigned in the company'),
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
      username: profile.username,
      email: profile.email,
      phone_number: formData.phone,
      first_name: formData.firstName,
      last_name: formData.lastName,
      department: formData.department,
      job_title: formData.jobTitle,
    };

    axiosInstance
      .patch('users/api/profile/', postData, null)
      .then(() => {
        handleClose();
        fetchAccount().then(({ userProfile }) => {
          setProfile(userProfile);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>Change user information.</DialogContentText>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Enter user detail information
            </Typography>

            <RHFTextField
              name="phone"
              label="Phone number"
              InputProps={{
                startAdornment: <InputAdornment position="start">+251</InputAdornment>,
              }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
            </Stack>
            <RHFTextField name="department" label="Department" />
            <RHFTextField name="jobTitle" label="Job title" />
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Update Profile
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
