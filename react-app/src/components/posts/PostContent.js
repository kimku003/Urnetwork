import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2"
        >
          {isExpanded ? 'Voir moins' : 'Voir plus'}
        </motion.button>
      )}
    </div>
  );
};

export default PostContent;