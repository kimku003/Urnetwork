import React, { useState } from 'react';

const ReactionButton = ({ post, onReact }) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactions = [
    { type: 'like', emoji: '👍', label: 'J\'aime' },
    { type: 'love', emoji: '❤️', label: 'J\'adore' },
    { type: 'haha', emoji: '😂', label: 'Haha' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Triste' },
    { type: 'angry', emoji: '😠', label: 'Grrr' },
  ];

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        onMouseEnter={() => setShowReactions(true)}
        onClick={() => onReact('like')}
      >
        <span className="text-xl">
          {post.user_reaction?.reaction_emoji || '👍'}
        </span>
        <span>{post.reactions_count || 0}</span>
      </button>

      {showReactions && (
        <div
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg px-2 py-1 flex space-x-1 animate-fade-in"
          onMouseLeave={() => setShowReactions(false)}
        >
          {reactions.map(reaction => (
            <button
              key={reaction.type}
              onClick={() => {
                onReact(reaction.type);
                setShowReactions(false);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 transform hover:scale-125"
              title={reaction.label}
            >
              <span className="text-2xl">{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;