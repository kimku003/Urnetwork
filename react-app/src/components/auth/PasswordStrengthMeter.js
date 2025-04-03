import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    return strength;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMessage = () => {
    if (strength < 25) return 'Très faible';
    if (strength < 50) return 'Faible';
    if (strength < 75) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          className={`h-full ${getColor()} transition-all duration-300`}
        />
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-sm mt-1 ${getColor().replace('bg-', 'text-')}`}
      >
        {getMessage()}
      </motion.p>
    </div>
  );
};

export default PasswordStrengthMeter;