import moment from 'moment';

import Iconify from 'components/Iconify';
import { axiosInstance, baseURL } from 'utils/axios';

// ----------------------------------------------------------------------
const getUserFullname = (profile) => {
  return profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.username;
};

const getPhoneNumber = (phoneNumber) => {
  return phoneNumber
    ? `+251 ${phoneNumber.toString().slice(0, 3)} ${phoneNumber.toString().slice(3, 5)} ${phoneNumber
        .toString()
        .slice(5)}`
    : '-';
};

const getPrivilage = (profile) => {
  return profile.is_main_user ? 'Client Admin' : profile.role[0].toUpperCase() + profile.role.substring(1);
};

export const fetchUsers = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('users/api/list')
      .then((res) => {
        if (res.data.results?.length > 0) {
          const USERLIST = res.data.results.map((profile) => ({
            id: profile.id,
            imageUrl: profile.image,
            user: profile.username,
            name: getUserFullname(profile),
            department: profile.department ? profile.department : '-',
            jobTitle: profile.job_title ? profile.job_title : '-',
            phone: getPhoneNumber(profile.phone_number),
            email: profile.email ? profile.email : '-',
            privilege: getPrivilage(profile),
            isActive: profile.is_active,
            isConfirmed: profile.is_confirmed,
          }));

          resolve(USERLIST);
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const cleanUserDetail = (userData) => {
  return {
    username: userData.username,
    displayName: getUserFullname(userData),
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    phoneNumber: getPhoneNumber(userData.phone_number),
    phone_number: userData.phone_number,
    role: getPrivilage(userData),
    dept: userData.department,
    jobTitle: userData.job_title,
    photoURL: `${baseURL}${userData.image.substring(1)}`,
    isMainAdmin: userData.is_main_user ? 'Yes' : 'No',
  };
};

const fetchAccount = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('users/api/profile/')
      .then((res) => {
        if (res.data) {
          resolve({ userProfile: cleanUserDetail(res.data) });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default fetchAccount;

export const cleanApprovedResultsList = (approvedData) =>
  approvedData
    .map((resultMonth) => {
      const summaryDate = new Date(`${resultMonth}-30`);

      const summaryYear = summaryDate?.getFullYear();
      const summaryMonth = summaryDate?.toLocaleString('default', { month: 'long' });
      const shortMonth = summaryDate?.toLocaleString('default', { month: 'short' });
      const monthLabel = `${shortMonth}, ${summaryYear}`;

      return { summaryYear, summaryMonth, monthLabel, summaryDate };
    })
    .sort((a, b) => (a.summaryDate > b.summaryDate ? -1 : 1))
    .map((optData) => {
      const { summaryDate, ...rest } = optData;
      return rest;
    });

export const refreshAccessToken = (postData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post('users/api/refresh-token/', postData)
      .then((res) => {
        localStorage.setItem('access_token', res.data.token.access);
        localStorage.setItem('refresh_token', res.data.token.refresh);

        axiosInstance.defaults.headers.Authorization = `JWT ${res.data.token.access}`;

        const userProfile = cleanUserDetail(res.data.user_detail);
        const approvedRes = cleanApprovedResultsList(res.data.approved_results);

        resolve({ userProfile, approvedRes, unreadNotifications: res.data.unread_notifications });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchCompanyInfo = () => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('users/api/institute-info/')
      .then((res) => {
        if (res.data) {
          resolve({
            companyInfo: {
              name: res.data.name,
              email: res.data.email,
              phone_number: res.data.phone_number,
              createdAt: new Date(res.data.date_created).toLocaleDateString('en-US', options),
              logo: res.data.logo,
              latestData: res.data.has_saved_analysis
                ? new Date(res.data.latest_saved_analysis).toLocaleDateString('en-US', options)
                : '-',
              phoneNumber: getPhoneNumber(res.data.phone_number),
            },
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const fetchCompanyConfigs = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get('users/api/institute-configs/')
      .then((res) => {
        if (res.data) {
          resolve({
            configurations: res.data,
          });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const notificationTypes = [
  { id: 'task_created', icon: <Iconify icon="ic:outline-add-task" sx={{ fontSize: '1.25rem' }} />, status: 'info' },
  {
    id: 'task_completed',
    icon: <Iconify icon="mdi:coffee-maker-done-outline" sx={{ fontSize: '1.25rem' }} />,
    status: 'primary',
  },
  { id: 'task_failed', icon: <Iconify icon="ant-design:exclamation-circle-outlined" />, status: 'error' },
  {
    id: 'remark',
    icon: <Iconify icon="ant-design:comment-outlined" sx={{ fontSize: '1.25rem' }} />,
    status: 'warning',
  },
  {
    id: 'approve',
    icon: <Iconify icon="ant-design:check-cirlce-outlined" sx={{ fontSize: '1.25rem' }} />,
    status: 'success',
  },
  {
    id: 'forum',
    icon: <Iconify icon="ant-design:question-circle-outlined" sx={{ fontSize: '1.25rem' }} />,
    status: 'primary',
  },
  {
    id: 'config_update',
    icon: <Iconify icon="ant-design:setting-outlined" sx={{ fontSize: '1.25rem' }} />,
    status: 'warning',
  },
];

export const fetchNotifications = (page = 1, pageSize = 10) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(`users/api/notifications/?page=${page}&page_size=${pageSize}`)
      .then((res) => {
        if (res.data.results?.length > 0) {
          const NOTICELIST = res.data.results.map((notice) => {
            const noticeType = notificationTypes.find((item) => item.id === notice.type);

            return {
              ...notice,
              noticezTime: moment(notice.created_at).format('hh:mm a'),
              icon: noticeType.icon,
              status: noticeType.status,
              get noticeDate() {
                const now = moment();
                const noticeTime = moment(notice.created_at);

                const hourDifference = now.diff(noticeTime, 'hours');
                if (hourDifference < 1) {
                  const minuteDifference = now.diff(noticeTime, 'minutes');
                  if (minuteDifference < 1) {
                    const secondDifference = now.diff(noticeTime, 'seconds');
                    return `${secondDifference} seconds ago`;
                  }

                  return `${minuteDifference} minutes ago`;
                }
                if (hourDifference > 24) {
                  return noticeTime.format('MMMM DD');
                }
                return `${hourDifference} hours ago`;
              },
            };
          });
          resolve({ notifications: NOTICELIST, pagination: res.data.pagination });
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const markNotificationsAsRead = (postData) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .patch('users/api/mark-notifications-as-read/', postData)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
