import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

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

export default function PasswordResetForm() {
  const navigate = useNavigate();

  const PasswordResetSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(PasswordResetSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const formData = methods.getValues();
    const postData = {
      email: formData.email,
    };
    axiosInstance
      .post('users/api/request-password-reset/', postData)
      .then((res) => {
        if (res.data?.message) {
          cogoToast.success(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="email"
          label="Email address"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" disablePointerEvents disableTypography>
                <IconButton edge="start" color="primary">
                  <Iconify icon="entypo:email" sx={{ height: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
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

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Request Reset
      </LoadingButton>
    </FormProvider>
  );
}
