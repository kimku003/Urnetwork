import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MessageList from '../components/messages/MessageList';
import Conversation from '../components/messages/Conversation';
import UserSearch from '../components/messages/UserSearch';

const Messages = () => {
  const location = useLocation();
  const isConversationOpen = location.pathname.includes('/messages/');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <UserSearch />
      </div>

      <div className="flex gap-6">
        <div className={`${isConversationOpen ? 'hidden md:block' : ''} w-full md:w-1/3`}>
          <MessageList />
        </div>
        
        <div className={`${isConversationOpen ? 'w-full' : 'hidden'} md:w-2/3`}>
          <Routes>
            <Route path=":userId" element={<Conversation />} />
            <Route 
              path="/" 
              element={
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] 
                  bg-white dark:bg-dark-secondary rounded-lg shadow-md">
                  <img 
                    src="/images/message-placeholder.svg" 
                    alt="Sélectionnez une conversation"
                    className="w-48 h-48 opacity-50"
                  />
                  <p className="mt-4 text-gray-500 dark:text-dark-text-secondary">
                    Sélectionnez une conversation ou recherchez un utilisateur
                  </p>
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