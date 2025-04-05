import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';
import NotificationBadge from '../notifications/NotificationBadge';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
        ${isActive 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
        }`}
    >
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </motion.div>
  </Link>
);

const DashboardLayout = () => {
  const [notifications, setNotifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', icon: HomeIcon, label: 'Accueil' },
    { to: '/profile', icon: UserIcon, label: 'Profil' },
    { to: '/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { to: '/settings', icon: Cog6ToothIcon, label: 'Paramètres' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo et Navigation Desktop */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <Logo />
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent"
                >
                  MonRéseau
                </motion.span>
              </Link>

              {/* Navigation Desktop */}
              <div className="hidden md:flex items-center ml-8 space-x-4">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    {...link}
                    isActive={location.pathname === link.to}
                  />
                ))}
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationBadge />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-blue-500"
              >
                <BellIcon className="w-6 h-6" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>

              {/* Profil Menu */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                    {username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-700">{username}</span>
                </motion.div>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Mon profil
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Paramètres
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bouton Menu Mobile */}
            <div className="md:hidden flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="px-4 py-2 space-y-2">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    {...link}
                    isActive={location.pathname === link.to}
                  />
                ))}
                <hr className="my-2" />
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                      {username?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-gray-700">{username}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="text-red-600 px-3 py-1 rounded-lg hover:bg-red-50"
                  >
                    Déconnexion
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;