import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../posts/Post';
import { motion } from 'framer-motion';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const currentUsername = localStorage.getItem('username');
  const isOwnProfile = !username || username === currentUsername;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileResponse = await axios.get(
        `http://localhost:8000/api/users/${currentUsername}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setProfile(profileResponse.data);
      setEditData({
        first_name: profileResponse.data.first_name || '',
        last_name: profileResponse.data.last_name || '',
        email: profileResponse.data.email || '',
        bio: profileResponse.data.bio || '',
        location: profileResponse.data.location || '',
        website: profileResponse.data.website || ''
      });

      // Correction : Utilisation stricte du filtre `author` pour récupérer uniquement les posts de l'utilisateur connecté
      const postsResponse = await axios.get(
        `http://localhost:8000/api/posts/?author=${currentUsername}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setPosts(postsResponse.data);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleImageUpload = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append(type === 'cover' ? 'cover_picture' : 'profile_picture', file);
      
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/users/${currentUsername}/`,
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      fetchProfile();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'image ${type}:`, error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/api/auth/profile/update/',
        editData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      {/* Photo de couverture */}
      <div className="relative h-72 bg-gray-300">
        {profile?.cover_picture ? (
          <img
            src={profile.cover_picture}
            alt="Couverture"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-all duration-200">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImageUpload('cover', e.target.files[0])}
                accept="image/*"
              />
              <PhotoIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Modifier</span>
            </label>
          </div>
        )}

        {/* Photo de profil */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-36 h-36 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile?.username[0].toUpperCase()}
                </div>
              )}
            </div>
            {isOwnProfile && (
              <label className="absolute -bottom-2 -right-2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload('profile', e.target.files[0])}
                  accept="image/*"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-blue-500 p-3 rounded-full shadow-lg text-white hover:bg-blue-600 transition-all duration-200"
                >
                  <CameraIcon className="w-5 h-5" />
                </motion.div>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Informations du profil */}
      <div className="bg-white rounded-b-lg shadow-md p-8 mt-16">
        <div className="ml-40">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profile?.username}</h1>
              {!isEditing ? (
                <div className="space-y-3 mt-4">
                  <p className="text-gray-600 text-lg">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-gray-500">{profile?.email}</p>
                  {profile?.bio && (
                    <p className="text-gray-700 mt-3">{profile.bio}</p>
                  )}
                  <div className="flex items-center space-x-6 text-gray-500 mt-4">
                    {profile?.location && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.location}
                      </div>
                    )}
                    {profile?.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        {new URL(profile.website).hostname}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editData.first_name}
                      onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                      placeholder="Prénom"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={editData.last_name}
                      onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                      placeholder="Nom"
                      className="p-2 border rounded-lg"
                    />
                  </div>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    placeholder="Email"
                    className="w-full p-2 border rounded-lg"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    placeholder="Bio"
                    rows="3"
                    className="w-full p-2 border rounded-lg resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      placeholder="Localisation"
                      className="p-2 border rounded-lg"
                    />
                    <input
                      type="url"
                      value={editData.website}
                      onChange={(e) => setEditData({...editData, website: e.target.value})}
                      placeholder="Site web"
                      className="p-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Enregistrer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
            {isOwnProfile && !isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Modifier le profil
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Publications de l'utilisateur */}
      <div className="space-y-8 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Publications</h2>
          <span className="text-gray-500">
            {posts.length} publication{posts.length > 1 ? 's' : ''}
          </span>
        </div>
        
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-gray-500 mb-4">
              Vous n'avez pas encore publié de contenu
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-500 hover:text-blue-600"
            >
              Créer votre première publication
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid gap-8"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <Post post={post} onUpdate={fetchProfile} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;