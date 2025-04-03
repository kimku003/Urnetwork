import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Post from '../posts/Post';
import { motion } from 'framer-motion';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/');
      setPosts(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des posts');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('content', newPost);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await api.post('/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setNewPost('');
      setSelectedImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    }
  };

  const handleImageError = (event) => {
    event.target.style.display = 'none';
    console.error('Erreur de chargement de l\'image');
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Formulaire de création de post */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Que voulez-vous partager ?"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
          
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Prévisualisation"
                className="mt-2 rounded-lg max-h-64 w-full object-cover"
                onError={handleImageError}
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
          
          <div className="flex items-center justify-between">
            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              accept="image/*"
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            <button
              type="submit"
              disabled={!newPost.trim() && !selectedImage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Publier
            </button>
          </div>
        </form>
      </div>

      {/* Liste des posts */}
      {posts.map((post) => (
        <Post key={post.id} post={post} onUpdate={fetchPosts} />
      ))}
    </div>
  );
};

export default Feed;