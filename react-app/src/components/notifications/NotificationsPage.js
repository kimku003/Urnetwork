import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import { notificationsApi } from '../../api/notifications';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsApi.getAll();
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BellIcon className="w-6 h-6" />
        Notifications
      </h1>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Chargement...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune notification pour le moment
          </p>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg shadow-sm border ${
                notification.read ? 'bg-gray-50' : 'bg-white border-blue-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`${!notification.read && 'font-semibold'}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <CheckCircleIcon className="w-6 h-6" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
