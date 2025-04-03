import React, { useState } from 'react';

const CommentSection = ({ post, onComment }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
      >
        {post.comments_count || 0} commentaires
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {post.comments?.map(comment => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {comment.user_username[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-medium text-sm">{comment.user_username}</p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Écrivez un commentaire..."
                className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;