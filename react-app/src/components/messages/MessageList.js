import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import messageService from '../../services/messageService';
import Avatar from '../common/Avatar';
import OnlineStatus from '../common/OnlineStatus';
import UnreadBadge from '../common/UnreadBadge';
import useWebSocket from '../../hooks/useWebSocket';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Badge from '../common/Badge';

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isUserOnline } = useOnlineStatus();
  const { user: currentUser } = useAuth();

  const handleWebSocketMessage = (data) => {
    if (data.type === 'new_message') {
      fetchConversations();
    }
  };

  useWebSocket(
    `ws://${window.location.hostname}:8000/ws/chat/notifications/`,
    handleWebSocketMessage
  );

  const fetchConversations = async () => {
    try {
      const response = await messageService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatLastMessageTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm');
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else if (now.getFullYear() === messageDate.getFullYear()) {
      return format(messageDate, 'd MMM', { locale: fr });
    }
    return format(messageDate, 'dd/MM/yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-dark-border">
        <h2 className="text-xl font-semibold dark:text-dark-text-primary">
          Messages
        </h2>
      </div>
      
      <div className="divide-y dark:divide-dark-border">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <motion.div
              key={conversation.user.id}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              className={`p-4 cursor-pointer ${
                parseInt(userId) === conversation.user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => navigate(`/messages/${conversation.user.id}`)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    src={conversation.user.profile_pic} 
                    alt={conversation.user.username}
                    className="w-12 h-12"
                  />
                  <OnlineStatus isOnline={isUserOnline(conversation.user.id)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      {conversation.user.username}
                    </p>
                    {conversation.last_message && (
                      <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        {formatLastMessageTime(conversation.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {conversation.last_message && (
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary truncate pr-4">
                        {conversation.last_message.sender.id === currentUser?.id ? (
                          <span className="text-gray-400">Vous : </span>
                        ) : null}
                        {conversation.last_message.content}
                      </p>
                    )}
                    <UnreadBadge count={conversation.unread_count} />
                    {conversation.unread_count > 0 && (
                      <Badge text="Nouveau" className="bg-red-500 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-dark-text-secondary">
            Aucune conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;