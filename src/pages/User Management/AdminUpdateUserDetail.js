import { useState, useEffect } from 'react';

// form
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Dialog,
  FormControlLabel,
  Switch,
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

export default function AdminUpdateUserDetail({ open, setOpen, setRefreshTime, updateData, userID }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    if (updateData) {
      setIsSwitchOn(updateData.isActive);
    }
  }, [updateData]);

  const defaultValues = {
    userRole: 'analyst',
  };

  const UpdateSchema = Yup.object().shape({
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
      username: userID,
      is_active: isSwitchOn,
      role: formData.userRole,
    };

    axiosInstance
      .patch('users/api/change-user-privilege/', postData, null)
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
      <DialogTitle>Change User Privilege and Status</DialogTitle>
      <DialogContent>
        <DialogContentText>Choose a new privilege for user or activation status for the account.</DialogContentText>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField select name="userRole" label="Choose a role for user">
                <MenuItem value="analyst">Analyst</MenuItem>
                <MenuItem value="examiner">Examiner</MenuItem>
                <MenuItem value="management">Management</MenuItem>
              </RHFTextField>
              <Typography variant="caption" color="goldenrod" gutterBottom>
                Be careful: changing user role will grant them new privilege or remove their current privilege.
              </Typography>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControlLabel
                name=""
                control={
                  <Switch
                    size="medium"
                    checked={isSwitchOn}
                    onChange={() => {
                      setIsSwitchOn(!isSwitchOn);
                    }}
                    color="success"
                  />
                }
                label={isSwitchOn ? 'Deactivate' : 'Activate'}
                componentsProps={{
                  typography: { variant: 'subtitle1', sx: { color: isSwitchOn ? 'error.main' : 'info.main' } },
                }}
              />
              <Typography variant="caption" color="goldenrod" gutterBottom>
                Be careful: changing user activation status to{' '}
                {isSwitchOn
                  ? "in-active will prevent the account from accessing this application. But the account will stay dormant until it's reactivated again."
                  : 'active will grant the account to use this application according to assigned privilege'}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
          <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
              Change Privilege
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
