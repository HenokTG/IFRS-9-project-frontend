import { axiosInstance } from '../utils/axios';

// ----------------------------------------------------------------------

const fetchAccount = (profilePk, setAccount, setProfile, setBankName) => {
  if (profilePk !== '*') {
    axiosInstance
      .get(`users/api/profiles/${profilePk}/`)
      .then((res) => {
        let dispName = res.data.first_name ? `${res.data.first_name} ${res.data.last_name}` : res.data.business_name;
        dispName = dispName !== null ? dispName : res.data.agent_name;
        // const phoneNo = res.data.phone.toString();
        setAccount({
          displayName: dispName,
          email: res.data.email,
          // phone: `+251 ${phoneNo.slice(0, 3)} ${phoneNo.slice(3, 5)} ${phoneNo.slice(5)}`,
          phone: '+251 920 80 9496',
          role: res.data.Job_title,
          dept: res.data.Department,
          institute: res.data.Institute,
          photoURL: res.data.image,
          avatorURL: '/static/mock-images/avatars/avatar_default.jpg',
        });
        setProfile(res.data);
        setBankName(res.data.Institute);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default fetchAccount;
