import React, { useEffect } from 'react';

const useDarkMode = (
  theme: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>
) => {
  useEffect(() => {
    setTheme(localStorage.getItem('theme') as string);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);

    return () => {
      document.documentElement.classList.remove(theme);
    };
  }, [theme]);
};

export default useDarkMode;
