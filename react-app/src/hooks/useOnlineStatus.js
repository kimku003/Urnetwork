import { useState, useEffect } from 'react';
import useWebSocket from './useWebSocket';

const useOnlineStatus = (users) => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const handleWebSocketMessage = (data) => {
    if (data.type === 'user_status') {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === 'online') {
          newSet.add(data.user_id);
        } else {
          newSet.delete(data.user_id);
        }
        return newSet;
      });
    }
  };

  useWebSocket(
    `ws://${window.location.hostname}:8000/ws/status/`,
    handleWebSocketMessage
  );

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  return { isUserOnline };
};

export default useOnlineStatus;