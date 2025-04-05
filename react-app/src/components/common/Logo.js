import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex-shrink-0"
    >
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12"
          stroke="url(#paint0_linear)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6"/>
            <stop offset="1" stopColor="#6366F1"/>
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default Logo;