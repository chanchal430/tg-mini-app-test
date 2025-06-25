import React, { createContext, useContext } from 'react';
import Colors from './Colors';

const ThemeContext = createContext({
  theme: 'dark' as 'dark' | 'light',
  colors: Colors.dark,
});

export const ThemeProvider = ({ children, theme = 'dark' }) => (
  <ThemeContext.Provider value={{ theme, colors: theme === 'dark' ? Colors.dark : Colors.light }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);