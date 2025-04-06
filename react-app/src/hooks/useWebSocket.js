import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url, onMessage) => {
  const ws = useRef(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    const wsUrl = `${url}${url.includes('?') ? '&' : '?'}token=${token}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connecté');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket déconnecté');
      // Tentative de reconnexion après 5 secondes
      setTimeout(connect, 5000);
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { sendMessage };
};

export default useWebSocket;