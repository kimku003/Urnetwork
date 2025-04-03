import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="fixed left-0 h-screen w-64 bg-white shadow-lg">
            <div className="p-4">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Word-Bucket
                </Link>
            </div>

            <nav className="mt-8 space-y-2">
                <Link to="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
                    <span className="mx-3">Accueil</span>
                </Link>

                {/* Liens d'authentification */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <Link 
                        to="/register" 
                        className="block w-full mb-2 px-4 py-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        S'inscrire
                    </Link>
                    <Link 
                        to="/login" 
                        className="block w-full px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                    >
                        Se connecter
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;