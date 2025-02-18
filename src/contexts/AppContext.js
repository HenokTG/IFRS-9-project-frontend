import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// context and modules
import { axiosInstance, baseURL, host } from 'utils/axios';

const myContext = React.createContext();

export const useGlobalContext = () => useContext(myContext);

export default function AppProvider({ children }) {
  const { pathname } = useLocation();

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchClosed, isSearchClosed] = useState(false);
  const [approvedResults, setApprovedResults] = useState([]);

  const [analysisProgress, setAnalysisProgress] = useState([]);

  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const webSocketConnection = useRef(null);
  const [wbReadyState, setWbReadyState] = useState(null);

  const handleWebSocketConnections = (userName, updateOn = '') => {
    const token = localStorage.getItem('access_token');
    const wsStart = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    const wsEndPoint = `${wsStart}${host}send-status-update/${userName}/?token=${token}`;

    webSocketConnection.current = new WebSocket(wsEndPoint);

    webSocketConnection.current.onopen = (e) => {
      setWbReadyState(webSocketConnection.current?.readyState);

      if (updateOn) {
        webSocketConnection.current.send(
          JSON.stringify({
            update_on: updateOn,
          })
        );
      }
    };

    webSocketConnection.current.onmessage = function (e) {
      const streamedData = JSON.parse(e.data);

      const getCleanedData = (data) => {
        return {
          analysisCode: data?.update_on,
          stage: data?.stage,
          status: data?.status,
          title: data?.name,
          total: data?.total,
          taskID: data?.task_id,
        };
      };

      if (streamedData.status_list) {
        const statusList = JSON.parse(streamedData.status_list);

        const cleanedStatusList = statusList.map((status) => {
          return getCleanedData(status.fields);
        });
        setAnalysisProgress(cleanedStatusList);
      } else {
        const newProgress = getCleanedData(streamedData);
        const isTaskCompleted = newProgress.stage === 1000 || newProgress.status === 'danger';

        if (isTaskCompleted) {
          setAnalysisProgress([{ isTaskCompleted, ...newProgress }]);
        } else {
          setAnalysisProgress((prevProgress) => [...prevProgress, newProgress]);
        }
      }
    };

    webSocketConnection.current.onclose = (e) => {
      console.log('Websocket connection closed', e);
    };
    webSocketConnection.current.onerror = (e) => {
      console.error(`Websocket closed unexpectedly`, e);
    };
  };

  useEffect(() => {
    if (loggedIn) {
      handleWebSocketConnections(profile.username);
    }

    return () => {
      webSocketConnection.current?.close();
    };
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const token = localStorage.getItem('access_token');
      const sseEndPoint = `${baseURL}notifications-events/${profile.username}/?channel=notifications_${profile.username}`;

      const eventSource = new EventSource(sseEndPoint, {
        headers: { Authorization: `JWT ${token}` },
      });

      eventSource.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        setUnreadNotifications(msg.unread_notifications);
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
      };
      return () => {
        eventSource.close();
      };
    }
  }, [loggedIn]);

  const getStatusList = (updateOn) => {
    if (wbReadyState === WebSocket.OPEN) {
      webSocketConnection.current.send(
        JSON.stringify({
          update_on: updateOn,
        })
      );
    } else if (wbReadyState === WebSocket.CLOSED) {
      handleWebSocketConnections(profile.username, updateOn);
    }
  };

  useEffect(() => {
    let updateOn = '';
    if (pathname === '/analysis/macro-ccf-analysis') {
      updateOn = 'FLI Progress';
    } else if (pathname === '/analysis/pd-input-data-organizer') {
      updateOn = 'PD Progress';
    } else if (pathname === '/analysis/ecl-analysis') {
      updateOn = 'ECL Progress';
    }

    if (loggedIn && updateOn) {
      getStatusList(updateOn);
    }
  }, [loggedIn, pathname, wbReadyState]);

  const handleLogout = () => {
    axiosInstance.post('users/api/logout/blacklist/', {
      refresh_token: localStorage.getItem('refresh_token'),
    });

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    axiosInstance.defaults.headers.Authorization = null;

    window.location.href = '/login';
    setLoggedIn(false);
    setProfile({});
  };

  return (
    <myContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        profile,
        setProfile,
        handleLogout,
        loading,
        setLoading,
        summary,
        setSummary,
        searchClosed,
        isSearchClosed,
        approvedResults,
        setApprovedResults,
        analysisProgress,
        unreadNotifications,
        setUnreadNotifications,
      }}
    >
      {children}
    </myContext.Provider>
  );
}
