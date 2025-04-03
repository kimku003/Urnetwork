import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../posts/Post';

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
    email: ''
  });

  const currentUsername = localStorage.getItem('username');
  const isOwnProfile = !username || username === currentUsername;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileResponse = await axios.get(
        `http://localhost:8000/api/users/${username || currentUsername}/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setProfile(profileResponse.data);
      setEditData({
        first_name: profileResponse.data.first_name,
        last_name: profileResponse.data.last_name,
        email: profileResponse.data.email
      });

      const postsResponse = await axios.get(
        `http://localhost:8000/api/posts/?author=${username || currentUsername}`,
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
    <div className="max-w-4xl mx-auto">
      {/* En-tête du profil */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl">
            {profile?.username[0].toUpperCase()}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{profile?.username}</h1>
            {!isEditing ? (
              <>
                <p className="text-gray-600">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-gray-500">{profile?.email}</p>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-3 mt-3">
                <input
                  type="text"
                  value={editData.first_name}
                  onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                  placeholder="Prénom"
                  className="p-2 border rounded-lg mr-2"
                />
                <input
                  type="text"
                  value={editData.last_name}
                  onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                  placeholder="Nom"
                  className="p-2 border rounded-lg mr-2"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  placeholder="Email"
                  className="p-2 border rounded-lg mr-2"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Modifier le profil
            </button>
          )}
        </div>
      </div>

      {/* Posts de l'utilisateur */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} onUpdate={fetchProfile} />
        ))}
      </div>
    </div>
  );
};

export default Profile;