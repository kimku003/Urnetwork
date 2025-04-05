import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Post from '../posts/Post';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    friendsCount: 0,
    likesCount: 0
  });
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    bio: '',
    location: '',
    website: '',
    occupation: '',
    birth_date: '',
    profile_visibility: 'Public'
  });

  const currentUsername = localStorage.getItem('username');
  const isOwnProfile = !username || username === currentUsername;

  const fetchProfile = async () => {
    try {
      const profileResponse = await api.get(`/users/${username || currentUsername}/`);
      setProfile(profileResponse.data);
      setEditData({
        bio: profileResponse.data.bio || '',
        location: profileResponse.data.location || '',
        website: profileResponse.data.website || '',
        occupation: profileResponse.data.occupation || '',
        birth_date: profileResponse.data.birth_date || '',
        profile_visibility: profileResponse.data.profile_visibility || 'public'
      });

      // Récupérer les statistiques
      const statsResponse = await api.get(`/users/${username || currentUsername}/stats/`);
      setStats(statsResponse.data);

      // Charger les posts selon l'onglet actif
      if (activeTab === 'posts') {
        const postsResponse = await api.get(`/posts/?author=${username || currentUsername}`);
        setPosts(postsResponse.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username, activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile/update/', editData);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-5xl"
          >
            {profile?.username[0].toUpperCase()}
          </motion.div>

          {/* Informations principales */}
          <div className="flex-grow space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{profile?.username}</h1>
              {isOwnProfile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isEditing ? 'Annuler' : 'Modifier le profil'}
                </motion.button>
              )}
            </div>

            {/* Statistiques */}
            <div className="flex space-x-6 text-gray-600">
              <div>
                <span className="font-bold">{stats.postsCount}</span> publications
              </div>
              <div>
                <span className="font-bold">{stats.friendsCount}</span> amis
              </div>
              <div>
                <span className="font-bold">{stats.likesCount}</span> j'aime reçus
              </div>
            </div>

            {/* Bio et infos */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="profile-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {profile?.bio && (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {profile?.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {profile.location}
                      </div>
                    )}
                    {profile?.occupation && (
                      <div className="flex items-center text-gray-600">
                        <BriefcaseIcon className="w-4 h-4 mr-2" />
                        {profile.occupation}
                      </div>
                    )}
                    {profile?.website && (
                      <div className="flex items-center text-gray-600">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-500 hover:underline">
                          {profile.website}
                        </a>
                      </div>
                    )}
                    {profile?.birth_date && (
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(profile.birth_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="profile-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleUpdateProfile}
                  className="space-y-4"
                >
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    placeholder="Votre bio..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows="3"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Localisation"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={editData.occupation}
                      onChange={(e) => setEditData({...editData, occupation: e.target.value})}
                      placeholder="Profession"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="url"
                      value={editData.website}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                      placeholder="Site web"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="date"
                      value={editData.birth_date}
                      onChange={(e) => setEditData({...editData, birth_date: e.target.value})}
                      className="p-2 border rounded-lg"
                    />
                    <select
                      value={editData.profile_visibility}
                      onChange={(e) => setEditData({...editData, profile_visibility: e.target.value})}
                      className="p-2 border rounded-lg"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Amis uniquement</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Enregistrer
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-center ${
              activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Publications
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-center ${
              activeTab === 'friends' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            Amis
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 text-center ${
              activeTab === 'likes' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          >
            J'aime
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {activeTab === 'posts' && posts.map(post => (
            <Post key={post.id} post={post} onUpdate={fetchProfile} />
          ))}
          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Liste des amis */}
            </div>
          )}
          {activeTab === 'likes' && (
            <div className="space-y-6">
              {/* Posts aimés */}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;