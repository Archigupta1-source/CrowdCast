import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (onMessage) => {
  const ws = useRef(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    let socket = null;
    let timeout = setTimeout(() => {
     socket = new WebSocket('wss://amusing-analysis-production-a05d.up.railway.app');
      ws.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected!');
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        onMessageRef.current(message);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected!');
      };

      socket.onerror = (err) => {
        console.log('WebSocket error:', err);
      };
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (socket) socket.close();
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendMessage };
};

export default useWebSocket;