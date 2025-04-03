import React from 'react';
import { UserAvatar } from './UserAvatar';

const Comment = ({ comment }) => {
  if (!comment) return null;

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <UserAvatar username={comment.author_username} size="small" />
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
  );
};

export default Comment;