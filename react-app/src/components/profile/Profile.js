import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const currentUser = localStorage.getItem('username');
  const [relationshipStatus, setRelationshipStatus] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/api/users/${username || 'me'}/`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setProfile(response.data);
        fetchPosts(response.data.id);
        if (username && username !== currentUser) {
          await fetchRelationshipStatus(response.data.id);
        }
      } catch (err) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, currentUser]);

  const fetchPosts = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/posts/?author=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des posts");
    }
  };

  const fetchRelationshipStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/relationships/?receiver=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.data.length > 0) {
        setRelationshipStatus(response.data[0].status);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut de la relation");
    }
  };

  const handleFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/relationships/',
        { receiver: profile.id },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setRelationshipStatus('pending');
    } catch (err) {
      setError("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!profile) return <div className="text-center p-8">Profil non trouvé</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mon Profil</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Contenu du profil à venir...</p>
      </div>
    </div>
  );
};

export default Profile;