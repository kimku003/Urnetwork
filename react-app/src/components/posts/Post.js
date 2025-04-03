import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';
import PostContent from './PostContent';

const UserAvatar = ({ username }) => {
  if (!username) return null;
  
  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
      {username[0].toUpperCase()}
    </div>
  );
};

const SharedPost = ({ post }) => {
  return (
    <div className="border rounded-lg p-4 mt-3 bg-gray-50">
      <div className="flex items-center space-x-3 mb-2">
        <UserAvatar username={post.author_username} />
        <div>
          <div className="font-medium text-sm">{post.author_username}</div>
          <div className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
      <PostContent content={post.content} />
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="mt-2 rounded-lg max-h-64 w-full object-cover"
        />
      )}
    </div>
  );
};

const Post = ({ post, onUpdate }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');

  const handleReaction = async (type) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/posts/${post.id}/react/`,
        { reaction_type: type },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setShowReactions(false);
      onUpdate();
    } catch (error) {
      console.error('Erreur de réaction:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/posts/${post.id}/comment/`,
        { content: newComment },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Erreur de commentaire:', error);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/posts/${post.id}/share/`,
        { content: shareContent },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setShowShareModal(false);
      setShareContent('');
      onUpdate();
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* En-tête du post */}
      <div className="p-4 flex items-center space-x-3">
        <Link to={`/profile/${post.author_username}`}>
          <UserAvatar username={post.author_username} />
        </Link>
        <div>
          <Link to={`/profile/${post.author_username}`} className="font-semibold hover:text-blue-600">
            {post.author_username}
          </Link>
          <p className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post partagé */}
      {post.original_post && (
        <div className="mx-4 mt-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3 mb-2">
            <UserAvatar username={post.original_post.author_username} />
            <div>
              <p className="font-semibold">{post.original_post.author_username}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.original_post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-gray-800">{post.original_post.content}</p>
        </div>
      )}

      {/* Contenu du post */}
      <div className="mt-3 px-4 pb-4">
        <PostContent content={post.content} />
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="" 
            className="mt-4 rounded-lg max-h-96 w-full object-cover"
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        {/* Compteurs */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>{post.reactions_count} réactions</div>
          <div>{post.comments?.length || 0} commentaires</div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span>👍</span>
            <span>Réagir</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-blue-600"
          >
            Commenter
          </button>

          <button 
            onClick={() => setShowShareModal(true)}
            className="text-blue-500 hover:text-blue-600"
          >
            Partager
          </button>
        </div>

        {/* Menu des réactions */}
        {showReactions && (
          <div className="absolute mt-2 bg-white rounded-full shadow-lg p-2 flex space-x-2">
            {['👍', '❤️', '😂', '😮', '😢', '😠'].map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleReaction(['like', 'love', 'haha', 'wow', 'sad', 'angry'][index])}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Section commentaires */}
        {showComments && (
          <div className="mt-4 space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <UserAvatar username={comment.author_username} />
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm">{comment.author_username}</p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            <form onSubmit={handleComment} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrire un commentaire..."
                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}

        {/* Modal de partage */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full mx-4"
            >
              <h3 className="text-xl font-bold mb-4">Partager ce post</h3>
              <textarea
                value={shareContent}
                onChange={(e) => setShareContent(e.target.value)}
                placeholder="Ajouter un commentaire au partage..."
                className="w-full p-3 border rounded-lg mb-4"
                rows="3"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Partager
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Post;