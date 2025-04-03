import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FriendManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Recherche d'utilisateurs
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/api/users/search/?query=${query}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Erreur lors de la recherche");
      } finally {
        setLoading(false);
      }
    }
  };

  // Récupération des suggestions d'amis
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/users/suggestions/',
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setSuggestions(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des suggestions");
      }
    };

    fetchSuggestions();
  }, []);

  // Récupération des demandes d'amis en attente
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/relationships/pending/',
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setPendingRequests(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des demandes");
      }
    };

    fetchPendingRequests();
  }, []);

  // Gestion des demandes d'amis
  const handleFriendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/relationships/',
        { receiver: userId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setSuggestions(suggestions.filter(user => user.id !== userId));
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande");
    }
  };

  // Accepter une demande d'ami
  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/relationships/${requestId}/accept/`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
    } catch (err) {
      setError("Erreur lors de l'acceptation de la demande");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Barre de recherche */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher des utilisateurs..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        {error && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )}
        
        {loading ? (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          searchQuery.length > 2 && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg p-4">
              {searchResults.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2">
                  <Link to={`/profile/${user.username}`} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="ml-3">{user.username}</span>
                  </Link>
                  <button
                    onClick={() => handleFriendRequest(user.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ajouter
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Demandes d'amis en attente */}
      {pendingRequests.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Demandes d'amis en attente</h2>
          {pendingRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {request.sender_username[0].toUpperCase()}
                </div>
                <span className="ml-3">{request.sender_username}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accepter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions d'amis */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Suggestions d'amis</h2>
        {suggestions.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2">
            <Link to={`/profile/${user.username}`} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.username[0].toUpperCase()}
              </div>
              <span className="ml-3">{user.username}</span>
            </Link>
            <button
              onClick={() => handleFriendRequest(user.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendManager;