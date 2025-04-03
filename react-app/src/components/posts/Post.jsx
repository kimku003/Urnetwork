import React from 'react';

const Post = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-4">
        <img 
          src={post.author.avatar} 
          alt={post.author.username}
          className="w-10 h-10 rounded-full mr-3" 
        />
        <div>
          <h3 className="font-semibold">{post.author.username}</h3>
          <p className="text-gray-500 text-sm">{post.created_at}</p>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{post.content}</p>
      {post.image && (
        <img src={post.image} alt="" className="rounded-lg mb-4" />
      )}
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
          <span>Like</span>
          <span>{post.likes_count}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
          <span>Comment</span>
          <span>{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
};

export default Post;