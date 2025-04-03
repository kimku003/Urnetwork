import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { UserPlusIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import IconButton from '../common/IconButton';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return value.length < 3 ? 'Le nom d\'utilisateur doit contenir au moins 3 caractères' : '';
      case 'email':
        return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Email invalide' : '';
      case 'password':
        return value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Les mots de passe ne correspondent pas' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  useEffect(() => {
    if (formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', formData.confirmPassword)
      }));
    }
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation finale
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register/', formData);
      navigate('/login');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.response?.data?.detail || 'Erreur lors de l\'inscription'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom d'utilisateur */}
          <div>
            <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.username ? 'border-red-500' : ''
              }`}
              required
            />
            <AnimatePresence>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.username}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : ''
              }`}
              required
            />
            <PasswordStrengthMeter password={formData.password} />
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              required
            />
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>

        <IconButton
          icon={UserPlusIcon}
          label="S'inscrire"
          disabled={loading || Object.keys(errors).length > 0}
          loading={loading}
          className="w-full mb-4"
          onClick={handleSubmit}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-gray-600 flex items-center justify-center space-x-2"
        >
          <span>Déjà un compte ?</span>
          <Link to="/login">
            <IconButton
              icon={ArrowLeftOnRectangleIcon}
              label="Se connecter"
              variant="secondary"
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;