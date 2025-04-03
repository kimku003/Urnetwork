import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );

  const [primaryColor, setPrimaryColor] = useState(() => 
    localStorage.getItem('primaryColor') || 'blue'
  );

  const [layout, setLayout] = useState(() => 
    localStorage.getItem('layout') || 'default'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor);
    document.documentElement.setAttribute('data-color', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem('layout', layout);
    document.documentElement.setAttribute('data-layout', layout);
  }, [layout]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      primaryColor,
      setPrimaryColor,
      layout,
      setLayout
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
};