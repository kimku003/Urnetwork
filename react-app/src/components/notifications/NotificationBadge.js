import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBadge = ({ count = 0 }) => (
  <Link to="/notifications">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 text-gray-600 hover:text-blue-500"
    >
      <BellIcon className="w-6 h-6" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
        >
          {count}
        </motion.span>
      )}
    </motion.div>
  </Link>
);

export default NotificationBadge;