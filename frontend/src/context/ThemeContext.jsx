import { createContext } from 'react';

// Minimal theme context provider without MUI.
// You can expand this later with custom theme values if needed.
export const ThemeProvider = ({ children }) => {
  return children;
};

const ThemeContext = createContext();

export default ThemeContext;