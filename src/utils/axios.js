import cogoToast from '@successtar/cogo-toast';

const axios = require('axios').default;

export const host = '//127.0.0.1:8000/';
export const baseURL = `${window.location.protocol}${host}`;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem('access_token') ? `JWT ${localStorage.getItem('access_token')}` : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    config.headers.Authorization = token ? `JWT ${token}` : null;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.success_message) {
      cogoToast.success(response.data?.success_message);
    }
    return response;
  },

  async (error) => {
    console.log('error', error);

    const originalRequest = error.config;

    const pathName = window.location.pathname;

    if (typeof error.response === 'undefined') {
      cogoToast.error('A server error occurred. Sorry about this - we will get it fixed shortly.');
      return Promise.reject(error);
    }

    if (error.response.status === 401 && originalRequest.url === `api/token/refresh/`) {
      localStorage.removeItem('refresh_token');

      window.location.href = `/login?redirectTo=${pathName}`;
      return Promise.reject(error);
    }

    if (
      error.response.data.code === 'token_not_valid' &&
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post('api/token/refresh/', { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem('access_token', response.data?.access);
              localStorage.setItem('refresh_token', response.data?.refresh);

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
              localStorage.removeItem('refresh_token');
            });
        }

        localStorage.removeItem('refresh_token');
        window.location.href = `/login?redirectTo=${pathName}`;

        cogoToast.error('Token expired. Please login again.');
      }
      window.location.href = `/login?redirectTo=${pathName}`;
      cogoToast.error("Token doesn't exist. Please login.");
    }

    if (error.code === 'ERR_BAD_REQUEST' && error.response?.data) {
      let errMessage = '';

      if (error.response?.data?.detail) {
        errMessage = error.response?.data?.detail;
      } else {
        errMessage = error.response?.data[Object.keys(error.response?.data)?.[0]][0];
      }

      return cogoToast.error(errMessage);
    }

    cogoToast.error('Error occured');

    return Promise.reject(error);
  }
);

export const downloadFile = (href) => {
  const fileName = href.split('/')[-1];
  const link = document.createElement('a');
  link.href = `${baseURL}${href.substring(1)}`;
  link.setAttribute('download', fileName);
  link.click();

  URL.revokeObjectURL(href);
};

export const downloadResult = (endpoint) => {
  const config = { responseType: 'blob' };

  axiosInstance
    .get(endpoint, config)
    .then((res) => {
      const fileName = res.headers.get('Content-Disposition')?.split('"')[1];
      if (fileName) {
        const href = URL.createObjectURL(res.data);

        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', fileName);
        link.click();

        URL.revokeObjectURL(href);
      }
    })
    .catch((error) => console.log(error));
};
