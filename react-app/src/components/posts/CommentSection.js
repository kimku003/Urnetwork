import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '../common/UserAvatar';

const CommentSection = ({ post, onComment }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onComment(comment);
      setComment('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowComments(!showComments)}
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2"
      >
        <span>{post.comments?.length || 0} commentaires</span>
        <motion.svg
          animate={{ rotate: showComments ? 180 : 0 }}
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex space-x-3"
                >
                  <div className="flex-shrink-0">
                    <UserAvatar username={comment.author_username} size="small" />
                  </div>
                  <div className="flex-grow">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <p className="font-medium text-sm">{comment.author_username}</p>
                      <p className="text-gray-700 break-words">{comment.content}</p>
                    </motion.div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center py-4"
              >
                Aucun commentaire pour le moment
              </motion.p>
            )}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4"
            >
              <div className="flex space-x-2">
                <motion.input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  whileFocus={{ scale: 1.01 }}
                />
                <motion.button
                  type="submit"
                  disabled={!comment.trim() || isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-lg
                    ${!comment.trim() || isSubmitting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;