import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const notificationsApi = {
  getAll: () => axios.get(`${API_URL}/api/notifications/`),
  getUnreadCount: () => axios.get(`${API_URL}/api/notifications/unread-count/`),
  markAsRead: (id) => axios.post(`${API_URL}/api/notifications/${id}/mark-read/`),
};
