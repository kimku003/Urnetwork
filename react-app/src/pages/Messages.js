import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MessageList from '../components/messages/MessageList';
import Conversation from '../components/messages/Conversation';

const Messages = () => {
  const location = useLocation();
  const isConversationOpen = location.pathname.includes('/messages/');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        <div className={`${isConversationOpen ? 'hidden md:block' : ''} w-full md:w-1/3`}>
          <MessageList />
        </div>
        
        <div className={`${isConversationOpen ? 'w-full' : 'hidden'} md:w-2/3 bg-white dark:bg-dark-secondary rounded-lg shadow`}>
          <Routes>
            <Route path=":userId" element={<Conversation />} />
            <Route 
              path="/" 
              element={
                <div className="flex items-center justify-center h-[calc(100vh-64px)] text-gray-500 dark:text-dark-text-secondary">
                  Sélectionnez une conversation pour commencer
                </div>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Messages;