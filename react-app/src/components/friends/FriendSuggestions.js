import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/relationships/',
        { receiver: userId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setSuggestions(suggestions.filter(user => user.id !== userId));
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  if (loading) return <div className="text-center p-4">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Suggestions d'amis</h2>
      <div className="space-y-4">
        {suggestions.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <Link to={`/profile/${user.username}`} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user.username[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </Link>
            <button
              onClick={() => handleSendRequest(user.id)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;