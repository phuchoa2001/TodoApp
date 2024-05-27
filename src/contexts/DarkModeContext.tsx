import React, { createContext } from 'react';
import { User } from '../types/user';

export const DarkModeContext = createContext<{
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}>({
  isDarkMode: false,
  toggleDarkMode: () => { },
});

export const DarkModeProvider: React.FC<{ children: React.ReactNode, user: User, setUser: (user: User) => void }> = ({ children, user, setUser }) => {
  const isDarkMode = user.theme === 'dark';

  const toggleDarkMode = () => {
    setUser({
      ...user,
      theme: user.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const darkModeValue = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <DarkModeContext.Provider value={darkModeValue}>
      {children}
    </DarkModeContext.Provider>
  );
};
