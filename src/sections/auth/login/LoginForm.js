import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from 'components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from 'components/hook-form';

// context and modules
import { axiosInstance } from 'utils/axios';
import { cleanUserDetail, cleanApprovedResultsList } from '_apiAxios/account';

import { useGlobalContext } from 'contexts/AppContext';

// ----------------------------------------------------------------------

const queryString = require('query-string');

export default function LoginForm() {
  const navigate = useNavigate();
  const nextLocation = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const { setLoggedIn, setProfile, setApprovedResults, setUnreadNotifications } = useGlobalContext();

  useEffect(() => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);

      if (tokenParts.exp > now) {
        setIsRemembered(true);
      } else {
        localStorage.removeItem('refresh_token');
      }
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('User name is required'),
    password: Yup.string().required('Password is required'),
  });

  const getDefaultValues = () => {
    return {
      userName: '',
      password: '',
      remember: isRemembered,
    };
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => methods.reset(getDefaultValues()), [isRemembered]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    const { redirectTo } = queryString.parse(nextLocation.search);
    const formData = methods.getValues();
    const postData = {
      username: formData.userName,
      password: formData.password,
    };
    axiosInstance
      .post('users/api/login/', postData)
      .then((res) => {
        if (res.data?.token?.access) {
          localStorage.setItem('access_token', res.data.token.access);
          if (formData.remember) {
            localStorage.setItem('refresh_token', res.data.token.refresh);
          } else {
            localStorage.removeItem('refresh_token');
          }

          axiosInstance.defaults.headers.Authorization = `JWT ${localStorage.getItem('access_token')}`;

          const userProfile = cleanUserDetail(res.data.user_detail);
          const approvedRes = cleanApprovedResultsList(res.data.approved_results);

          setLoggedIn(true);
          setProfile(userProfile);
          setApprovedResults(approvedRes);
          setUnreadNotifications(res.data.unread_notifications);
        }

        navigate(!redirectTo ? '/dashboard' : redirectTo, { replace: true });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="userName" label="User name" />
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {isRemembered ? <span /> : <RHFCheckbox name="remember" label="Remember me" />}
        <Link
          onClick={() => {
            navigate('/forget-password');
          }}
          variant="subtitle2"
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
