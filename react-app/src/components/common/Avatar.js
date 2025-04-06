import React from 'react';

const Avatar = ({ src, alt, className = "" }) => {
  const initials = alt ? alt.charAt(0).toUpperCase() : '?';

  return src ? (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
    />
  ) : (
    <div className={`flex items-center justify-center bg-blue-500 text-white rounded-full ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;