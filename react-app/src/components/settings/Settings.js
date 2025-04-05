import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { theme: globalTheme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmNewPassword: '',
    notifications_enabled: true,
    email_notifications: true,
    profile_privacy: 'public',
    theme: 'light'
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me/');
        setFormData(prevState => ({
          ...prevState,
          email: response.data.email,
          notifications_enabled: response.data.notifications_enabled || true,
          email_notifications: response.data.email_notifications || true,
          profile_privacy: response.data.profile_privacy || 'public',
          theme: response.data.theme || globalTheme
        }));
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error('Erreur:', err);
      }
    };

    fetchUserData();
  }, [globalTheme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me/', formData);
      setMessage("Paramètres mis à jour avec succès");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de la mise à jour des paramètres");
      setMessage(null);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));

    // Si c'est le thème qui change, on appelle aussi toggleTheme
    if (name === 'theme') {
      toggleTheme();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 dark:text-dark-text">
        <h2 className="text-2xl font-bold mb-6 dark:text-dark-text">Paramètres</h2>
        
        <div className="mb-6 border-b dark:border-dark-border">
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('account')}
              className={`py-2 px-4 ${
                activeTab === 'account' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Compte
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('privacy')}
              className={`py-2 px-4 ${activeTab === 'privacy' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            >
              Confidentialité
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded"
            >
              {message}
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'account' ? (
            <motion.form
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                    dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Sauvegarder les modifications
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Notifications</label>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'notifications_enabled', type: 'checkbox', checked: !formData.notifications_enabled } })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications_enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <motion.span
                    animate={{ x: formData.notifications_enabled ? 20 : 2 }}
                    className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-700">Notifications par email</label>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleChange({ target: { name: 'email_notifications', type: 'checkbox', checked: !formData.email_notifications } })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.email_notifications ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <motion.span
                    animate={{ x: formData.email_notifications ? 20 : 2 }}
                    className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  />
                </motion.button>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Confidentialité du profil</label>
                <select
                  name="profile_privacy"
                  value={formData.profile_privacy}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                    dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
                >
                  <option value="public">Public</option>
                  <option value="friends">Amis uniquement</option>
                  <option value="private">Privé</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-700 dark:text-dark-text">
                  Thème {formData.theme === 'dark' ? 'sombre' : 'clair'}
                </label>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleChange({ 
                    target: { 
                      name: 'theme', 
                      value: formData.theme === 'light' ? 'dark' : 'light' 
                    } 
                  })}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors p-1
                    ${formData.theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'}`}
                >
                  <motion.div
                    animate={{ x: formData.theme === 'dark' ? 40 : 0 }}
                    className={`flex items-center justify-center h-8 w-8 rounded-full 
                      ${formData.theme === 'dark' 
                        ? 'bg-gray-900 dark:bg-gray-800' 
                        : 'bg-blue-500'}`}
                  >
                    {formData.theme === 'dark' ? 
                      <FiMoon className="text-white" /> : 
                      <FiSun className="text-white" />
                    }
                  </motion.div>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Sauvegarder les préférences
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Settings;