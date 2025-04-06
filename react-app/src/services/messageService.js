import api from './api';

const messageService = {
  getConversations: () => api.get('/messages/conversations/'),
  
  getMessagesWithUser: (userId) => 
    api.get(`/messages/with_user/?user_id=${userId}`),
  
  sendMessage: async (recipientId, content) => {
    try {
      const response = await api.post('/messages/', {
        recipient_id: recipientId,
        content: content
      });
      return response;
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message);
      throw error;
    }
  },
  
  markAsRead: (messageId) => 
    api.patch(`/messages/${messageId}/`, { read: true })
};

export default messageService;