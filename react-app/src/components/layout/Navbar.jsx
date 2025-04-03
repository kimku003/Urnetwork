import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Word-Bucket
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/feed" className="text-gray-600 hover:text-gray-900">Feed</Link>
            <Link to="/messages" className="text-gray-600 hover:text-gray-900">Messages</Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;