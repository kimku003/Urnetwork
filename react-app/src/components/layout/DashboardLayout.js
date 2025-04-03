import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold text-blue-600"
                >
                  MonRéseau
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Accueil
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  Profil
                </Link>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <span>{username}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </Menu.Button>
                
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/settings"
                          className={`${
                            active ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                          } block px-4 py-2`}
                        >
                          Paramètres
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 text-red-600' : 'text-red-500'
                          } block w-full text-left px-4 py-2`}
                        >
                          Déconnexion
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto py-6 px-4"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;