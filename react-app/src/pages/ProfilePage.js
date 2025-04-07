import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Post from '../components/posts/Post';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    if (!username && currentUser) {
      // Si pas de username dans l'URL, charger le profil de l'utilisateur connecté
      fetchUserProfile(currentUser);
    } else if (username === currentUser) {
      // Si l'URL pointe vers l'utilisateur connecté, rediriger vers /profile
      navigate('/profile');
    } else {
      // Sinon charger le profil de l'utilisateur demandé
      fetchProfile();
    }
  }, [username, currentUser]);

  const fetchUserProfile = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profiles/${username}/`);
      setProfile(response.data);
      const postsResponse = await axios.get(`http://localhost:8000/api/posts/user/${username}/`);
      setUserPosts(postsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profiles/${username}/`);
      setProfile(response.data);
      
      const postsResponse = await axios.get(`http://localhost:8000/api/posts/user/${username}/`);
      setUserPosts(postsResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/profiles/${username}/follow/`);
      setIsFollowing(!isFollowing);
      setProfile(prev => ({
        ...prev,
        followers_count: isFollowing ? prev.followers_count - 1 : prev.followers_count + 1
      }));
    } catch (error) {
      console.error('Erreur lors du suivi:', error);
    }
  };

  const handleFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:8000/api/profiles/${username}/friend-request/`);
      setFriendRequestSent(true);
    } catch (error) {
      console.error('Erreur lors de la demande d\'ami:', error);
    }
  };

  const handleMessage = () => {
    navigate(`/messages/new/${username}`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl">
              {profile?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.username}</h1>
              <p className="text-gray-600">{profile?.bio || 'Aucune bio'}</p>
              <div className="flex space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  {profile?.posts_count || 0} publications
                </span>
                <span className="text-sm text-gray-500">
                  {profile?.followers_count || 0} abonnés
                </span>
                <span className="text-sm text-gray-500">
                  {profile?.following_count || 0} abonnements
                </span>
              </div>
            </div>
          </div>

          {username !== currentUser && (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? 'Ne plus suivre' : 'Suivre'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFriendRequest}
                disabled={friendRequestSent || isFriend}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isFriend
                    ? 'bg-green-100 text-green-600'
                    : friendRequestSent
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                {isFriend ? 'Ami' : friendRequestSent ? 'Demande envoyée' : 'Ajouter'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMessage}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Message
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="space-y-4">
        {userPosts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
