import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import cogoToast from '@successtar/cogo-toast';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from 'components/Iconify';
import { FormProvider, RHFTextField } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';

// ----------------------------------------------------------------------

export default function PasswordResetForm() {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const isResetForm = uidb64;
  const [showPassword, setShowPassword] = useState(false);

  const PassResetSchema = Yup.object().shape({
    password0: isResetForm ? Yup.string() : Yup.string().required('Current password is required'),
    password: Yup.string().required('New Password is required'),
    password2: Yup.string().required('Confirm password should be same as the new assword'),
  });

  const defaultValues = {
    password0: '',
    password: '',
    password2: '',
  };

  const methods = useForm({
    resolver: yupResolver(PassResetSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();

    let postData = {};
    const newPasswords = { password: formData.password, confirm_password: formData.password2 };

    if (isResetForm) {
      postData = { uidb64, token, ...newPasswords };
    } else {
      postData = { current_password: formData.password0, ...newPasswords };
    }

    const postURL = `users/api/${isResetForm ? 'reset' : 'change'}-password/`;

    axiosInstance
      .post(postURL, postData)
      .then((res) => {
        if (res.data?.message) {
          cogoToast.success(res.data.message);
        }

        navigate('/login');
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!isResetForm && <RHFTextField name="password0" label="Current Password" />}
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField name="password2" label="Confirm Password" type={showPassword ? 'text' : 'password'} />
      </Stack>
      {isResetForm && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Link
            onClick={() => {
              navigate('/login');
            }}
            variant="subtitle2"
            underline="hover"
            sx={{ cursor: 'pointer' }}
          >
            Login?
          </Link>
        </Stack>
      )}
      <LoadingButton sx={{ mt: 2 }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Set New Password
      </LoadingButton>
    </FormProvider>
  );
}
