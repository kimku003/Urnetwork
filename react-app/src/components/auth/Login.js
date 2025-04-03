import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import IconButton from '../common/IconButton';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', formData);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('username', user.username);
      
      // Configurer le token par défaut pour les futures requêtes
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      navigate('/');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.detail || 'Identifiants invalides');
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
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-500 p-3 rounded-lg mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <IconButton
            icon={ArrowRightOnRectangleIcon}
            label="Se connecter"
            disabled={loading}
            loading={loading}
            className="w-full mb-4"
            onClick={handleLogin}
          />
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-gray-600 flex items-center justify-center space-x-2"
        >
          <span>Pas encore de compte ?</span>
          <Link to="/register">
            <IconButton
              icon={UserPlusIcon}
              label="Créer un compte"
              variant="secondary"
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;