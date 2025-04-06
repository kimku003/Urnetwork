import React from 'react';

const UnreadBadge = ({ count }) => {
  if (!count) return null;

  return (
    <div className="flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 
      bg-blue-500 text-white text-xs font-medium rounded-full">
      {count > 99 ? '99+' : count}
    </div>
  );
};

export default UnreadBadge;