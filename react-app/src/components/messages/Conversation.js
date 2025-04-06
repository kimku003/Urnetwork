import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import messageService from '../../services/messageService';
import { useAuth } from '../../contexts/AuthContext';
import useWebSocket from '../../hooks/useWebSocket';
import Avatar from '../common/Avatar';

const Conversation = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const handleWebSocketMessage = (data) => {
    if (data.type === 'new_message' && 
        (data.message.sender.id === parseInt(userId) || 
         data.message.recipient.id === parseInt(userId))) {
      setMessages(prev => [...prev, data.message]);
    }
  };

  useWebSocket(
    `ws://${window.location.hostname}:8000/ws/chat/notifications/`,
    handleWebSocketMessage
  );
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await messageService.getMessagesWithUser(userId);
        setMessages(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const response = await messageService.sendMessage(userId, newMessage.trim());
      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage(''); // Réinitialiser le champ de message
        scrollToBottom(); // Faire défiler vers le bas
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // Optionnel : Afficher une notification d'erreur
      alert('Erreur lors de l\'envoi du message');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 border-b dark:border-dark-border">
        <div className="flex items-center space-x-3">
          {userId && (
            <Avatar 
              src={messages[0]?.sender.id === parseInt(userId) 
                ? messages[0]?.sender.profile_pic 
                : messages[0]?.recipient.profile_pic
              }
              alt={messages[0]?.sender.id === parseInt(userId)
                ? messages[0]?.sender.username
                : messages[0]?.recipient.username
              }
              className="w-10 h-10"
            />
          )}
          <h2 className="text-xl font-semibold dark:text-dark-text-primary">
            {messages[0]?.sender.id === parseInt(userId)
              ? messages[0]?.sender.username
              : messages[0]?.recipient.username
            }
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender.id === currentUser?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-dark-accent dark:text-dark-text-primary'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t dark:border-dark-border">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-dark-secondary dark:border-dark-border dark:text-dark-text-primary"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;