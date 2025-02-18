import { host, downloadResult } from 'utils/axios';

export const openWebSocket = (userName, setAnalysisProgress) => {
  const loc = window.location;
  const wsStart = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsEndPoint = `${wsStart}${host}send-status-update/${userName}/?token=${localStorage.getItem('access_token')}`;

  const eclSocket = new WebSocket(wsEndPoint);
  eclSocket.onopen = (e) => console.log('You have Open Connection!', e);
  eclSocket.onmessage = (e) => {
    const streamedData = JSON.parse(e.data);

    if (typeof setAnalysisProgress === 'function') {
      const progressJSON = {
        analysisCode: streamedData.update_on,
        stage: streamedData.stage,
        status: streamedData.status,
        title: streamedData.name,
        total: streamedData.total,
        taskID: streamedData.task_id,
      };
      setAnalysisProgress(progressJSON);
    }

    const taskIdPD = streamedData.task_id;
    const profilePk = streamedData.update_for;

    const isPDConversionCompleted =
      taskIdPD && profilePk === userName && streamedData.update_on === 'PD Progress' && streamedData.stage === 575;

    if (isPDConversionCompleted) {
      const downloadExcelAPI = `pd-input-data-organizer/api/download-pd-excel/${profilePk}/${taskIdPD}`;

      downloadResult(downloadExcelAPI);
    }
  };
  eclSocket.onerror = (e) => console.log(`error`, e);
  eclSocket.onclose = (e) => console.log('Connection Closed', e);
};
