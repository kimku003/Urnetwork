import React, { useState, useEffect, useCallback } from 'react';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const reactions = [
    { type: 'like', emoji: '👍', label: 'J\'aime' },
    { type: 'love', emoji: '❤️', label: 'J\'adore' },
    { type: 'haha', emoji: '😂', label: 'Haha' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Triste' },
    { type: 'angry', emoji: '😠', label: 'Grrr' }
  ];

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

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/posts/${post.id}/comments/`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  }, [post.id]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, fetchComments]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/posts/${post.id}/comment/`,
        {
          content: newComment,
          post: post.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setNewComment('');
        fetchComments(); // Recharger les commentaires
        console.log('Commentaire ajouté avec succès:', response.data);
      }
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data);
      console.error('Statut:', error.response?.status);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover-card animate-fade-in">
      {/* En-tête du post */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white transform transition-all duration-200 hover:scale-105">
            {post.author_username[0].toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{post.author_username}</div>
            <div className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Contenu du post */}
        <PostContent content={post.content} />
        
        {post.image_url && (
          <img
            src={post.image_url}
            alt=""
            className="mt-4 rounded-lg max-h-96 w-full object-cover"
          />
        )}

        {/* Post partagé */}
        {post.original_post_data && (
          <SharedPost post={post.original_post_data} />
        )}
      </div>

      {/* Barre d'actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Menu des réactions */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="reaction-button"
            >
              <span className="text-xl">
                {post.user_reaction?.reaction_emoji || '👍'}
              </span>
              <span>{post.reactions_count || 0}</span>
            </button>

            <CSSTransition
              in={showReactions}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-2 flex space-x-1 animate-pop-in">
                {reactions.map(reaction => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
                    className="reaction-button p-2 hover:bg-gray-100 rounded-full"
                    title={reaction.label}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                  </button>
                ))}
              </div>
            </CSSTransition>
          </div>

          {/* Bouton commentaires */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span>{post.comments?.length || 0} commentaires</span>
          </button>

          {/* Bouton partager */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <span>{post.share_count || 0} partages</span>
          </button>
        </div>
      </div>

      {/* Section commentaires */}
      <CSSTransition
        in={showComments}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="space-y-4 mb-4">
            {comments.map((comment, index) => (
              <div
                key={comment.id}
                className="flex space-x-3 mb-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                    {comment.author_username[0].toUpperCase()}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-sm mb-1">{comment.author_username}</p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commenter
            </button>
          </form>
        </div>
      </CSSTransition>

      {/* Modal de partage */}
      <CSSTransition
        in={showShareModal}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg animate-scale-in">
            <h3 className="text-lg font-semibold mb-4">Partager ce post</h3>
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
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Post;