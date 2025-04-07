import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Feed from './components/feed/Feed';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';
import DashboardLayout from './components/layout/DashboardLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import Messages from './pages/Messages';
import NotificationsPage from './components/notifications/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="messages/*" element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile/:username" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
