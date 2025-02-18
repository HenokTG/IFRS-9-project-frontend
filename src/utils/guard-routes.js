import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

// project import
import { useGlobalContext } from 'contexts/AppContext';
import { refreshAccessToken } from '_apiAxios/account';

// ==============================|| AUTH GUARD ||============================== //

const ProtectedRoute = ({ userRole }) => {
  const navigate = useNavigate();
  const prevLocation = useLocation();

  const { loggedIn, profile, setLoggedIn, setProfile, setApprovedResults, setUnreadNotifications } = useGlobalContext();

  const routeCanBeShown = async () => {
    let role = profile.role;
    let isAuthorized = loggedIn;

    const refreshToken = localStorage.getItem('refresh_token');

    if (!loggedIn && refreshToken) {
      const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);

      if (tokenParts.exp > now) {
        await refreshAccessToken({ refresh: refreshToken }).then(
          ({ userProfile, approvedRes, unreadNotifications }) => {
            isAuthorized = true;
            role = userProfile.role;

            setLoggedIn(true);
            setProfile(userProfile);
            setApprovedResults(approvedRes);
            setUnreadNotifications(unreadNotifications);
          }
        );
      } else {
        localStorage.removeItem('refresh_token');
      }
    }

    return isAuthorized && (!userRole || userRole.includes(role));
  };

  useEffect(
    () => {
      routeCanBeShown().then((hasRole) => {
        if (!hasRole) {
          navigate(`/login?redirectTo=${prevLocation.pathname}`);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn]
  );

  return <Outlet context={[userRole]} />;
};

ProtectedRoute.propTypes = {
  userRole: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), null]),
};

export default ProtectedRoute;
