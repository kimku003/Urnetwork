import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'default' }) => {
  const sizes = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`${sizes[size]} relative`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <circle cx="20" cy="20" r="20" className="fill-blue-500" />
        <path
          d="M12 20C12 16.13 15.13 13 19 13C22.87 13 26 16.13 26 20C26 23.87 22.87 27 19 27"
          className="stroke-white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="28"
          cy="20"
          r="3"
          className="fill-white"
        />
      </svg>
    </motion.div>
  );
};

export default Logo;