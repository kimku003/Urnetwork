import React from 'react';
import { motion } from 'framer-motion';

const IconButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  disabled, 
  className = '',
  loading = false,
  variant = 'primary'
}) => {
  const baseStyles = "flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors duration-200";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-t-2 border-current rounded-full animate-spin" />
          <span className="sr-only">Chargement...</span>
        </>
      ) : (
        <>
          <Icon className="w-5 h-5" />
          {label && <span className="sr-only">{label}</span>}
        </>
      )}
    </motion.button>
  );
};

export default IconButton;