import React from 'react';

export const UserAvatar = ({ username, size = "default" }) => {
  if (!username) return null;

  const sizeClasses = {
    small: "h-8 w-8 text-sm",
    default: "h-10 w-10 text-base",
    large: "h-12 w-12 text-lg"
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r 
        from-blue-500 
        to-indigo-500 
        flex 
        items-center 
        justify-center 
        text-white
      `}
    >
      {username[0].toUpperCase()}
    </div>
  );
};

export default UserAvatar;