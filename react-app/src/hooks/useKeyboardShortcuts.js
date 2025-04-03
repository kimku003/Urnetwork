import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'j':
            e.preventDefault();
            toggleTheme();
            break;
          case 'p':
            e.preventDefault();
            navigate('/new-post');
            break;
          case 'k':
            e.preventDefault();
            document.querySelector('#search-input')?.focus();
            break;
          case 'h':
            e.preventDefault();
            navigate('/');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme, navigate]);
};