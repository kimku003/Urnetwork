import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const PostContent = ({ content, maxLength = 280 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = content.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? `${content.slice(0, maxLength)}...` 
    : content;

  return (
    <div>
      <p className="text-gray-800 whitespace-pre-wrap">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-1"
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
};

const SharedPost = ({ post }) => {
  return (
    <div className="border rounded-lg p-4 mt-3 bg-gray-50">
      <div className="flex items-center space-x-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white text-sm">
          {post.author_username[0].toUpperCase()}
        </div>
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

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* En-tête du post */}
      <div className="p-4 flex items-center space-x-3">
        <Link to={`/profile/${post.author_username}`}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
            {post.author_username[0].toUpperCase()}
          </div>
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

      {/* Contenu du post */}
      <div className="px-4 pb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt="" 
            className="mt-4 rounded-lg max-h-96 w-full object-cover cursor-pointer"
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
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                    {comment.author_username[0].toUpperCase()}
                  </div>
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
      </div>
    </div>
  );
};

export default Post;