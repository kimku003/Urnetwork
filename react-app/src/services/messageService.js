import api from './api';

export const messageService = {
  getConversations: () => api.get('/messages/conversations/'),
  
  getMessagesWithUser: (userId) => 
    api.get(`/messages/with_user/?user_id=${userId}`),
  
  sendMessage: (recipientId, content) => 
    api.post('/messages/', {
      recipient_id: recipientId,
      content
    }),
  
  markAsRead: (messageId) => 
    api.patch(`/messages/${messageId}/`, { read: true })
};

export default messageService;