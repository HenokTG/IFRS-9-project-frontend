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
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { FormProvider, RHFTextField } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';

// ----------------------------------------------------------------------

export default function AdminAddUser({ open, setOpen, setRefreshTime }) {
  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    userRole: 'analyst',
  };

  const UpdateSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    userRole: Yup.string().required('Please select role for the user'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const formData = methods.getValues();

    const postData = {
      username: formData.username,
      email: formData.email,
      employer: '',
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.userRole,
    };

    axiosInstance
      .post(`users/api/register/`, postData, null)
      .then((res) => {
        handleClose();
        setRefreshTime(Date.now());
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
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add user for specific role. The user can use their account after email confirmation.
        </DialogContentText>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
            <Typography variant="subtitle1" gutterBottom>
              Enter Basic Information
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="username" label="Enter unique user name" />
              <RHFTextField select name="userRole" label="Choose a role for user">
                <MenuItem value="analyst">Analyst</MenuItem>
                <MenuItem value="examiner">Examiner</MenuItem>
                <MenuItem value="management">Management</MenuItem>
              </RHFTextField>
            </Stack>
            <RHFTextField name="email" label="Email address" />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Add User
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
