import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Appearance = () => {
  const { theme, toggleTheme, primaryColor, setPrimaryColor, layout, setLayout } = useTheme();

  const colorOptions = [
    { id: 'blue', name: 'Bleu', class: 'bg-blue-500' },
    { id: 'purple', name: 'Violet', class: 'bg-purple-500' },
    { id: 'green', name: 'Vert', class: 'bg-green-500' }
  ];

  const layoutOptions = [
    { id: 'compact', name: 'Compact' },
    { id: 'default', name: 'Standard' },
    { id: 'comfortable', name: 'Confortable' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Paramètres d'apparence
      </h2>

      {/* Section Thème */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Thème
        </h3>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white"
        >
          {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
        </button>
      </div>

      {/* Section Couleurs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Couleur principale
        </h3>
        <div className="flex space-x-4">
          {colorOptions.map(color => (
            <button
              key={color.id}
              onClick={() => setPrimaryColor(color.id)}
              className={`w-10 h-10 rounded-full ${color.class} transition-transform hover:scale-110 ${
                primaryColor === color.id ? 'ring-2 ring-offset-2' : ''
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Section Layout */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Disposition
        </h3>
        <div className="grid gap-2">
          {layoutOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setLayout(option.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                layout === option.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Section Raccourcis */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
          Raccourcis clavier
        </h3>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-800 dark:text-gray-200">Thème clair/sombre</span>
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300">
              Ctrl + J
            </kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-800 dark:text-gray-200">Nouveau post</span>
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300">
              Ctrl + P
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;