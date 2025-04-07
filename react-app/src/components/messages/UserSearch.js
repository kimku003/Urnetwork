import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/users/search/?query=${searchQuery}`);
      setResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchUsers(value);
  };

  const startConversation = (userId) => {
    navigate(`/messages/${userId}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher un utilisateur..."
          className="w-full p-3 pl-10 rounded-lg border dark:border-dark-border 
            dark:bg-dark-secondary dark:text-dark-text-primary
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {loading && (
        <div className="absolute inset-x-0 top-full mt-2 p-4 bg-white dark:bg-dark-secondary 
          rounded-lg shadow-lg border dark:border-dark-border flex justify-center items-center">
          <FiLoader className="animate-spin text-blue-500 text-2xl" />
          <span className="ml-2 text-blue-500">Recherche en cours...</span>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="absolute inset-x-0 top-full mt-2 bg-white dark:bg-dark-secondary 
          rounded-lg shadow-lg border dark:border-dark-border max-h-60 overflow-auto">
          {results.map(user => (
            <button
              key={user.id}
              onClick={() => startConversation(user.id)}
              className="flex items-center w-full p-3 hover:bg-gray-50 
                dark:hover:bg-dark-accent transition-colors"
            >
              <img
                src={user.profile_pic || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3 text-left">
                <p className="font-medium dark:text-dark-text-primary">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  {user.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;