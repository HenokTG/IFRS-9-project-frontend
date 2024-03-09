export const openWebSocket = (userName, setAnalysisProgress) => {
  const loc = window.location;
  const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
  const endPoint = `${wsStart}127.0.0.1:8000${loc.pathname}/ws/${userName}/?token=${localStorage.getItem(
    'access_token'
  )}`;

  const eclSocket = new WebSocket(endPoint);
  eclSocket.onopen = (e) => console.log('You have Open Connection!', e);
  eclSocket.onmessage = (e) => {
    const streamedData = JSON.parse(e.data).message;
    const progressJSON = {
      analysisCode: streamedData.Update_on,
      stage: streamedData.Stage,
      status: streamedData.Status,
      title: streamedData.Name,
      total: streamedData.Total,
    };
    setAnalysisProgress(progressJSON);
  };
  eclSocket.onerror = (e) => console.log(`error`, e);
  eclSocket.onclose = (e) => console.log('Connection Closed', e);
};
