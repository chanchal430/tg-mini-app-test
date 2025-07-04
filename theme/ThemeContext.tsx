import * as React from "react";
import { createContext, useContext, ReactNode } from "react";
import Colors from "./Colors";

// Define the type for the theme
type ThemeType = "dark" | "light";

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof Colors.dark; // Assuming Colors.dark and Colors.light have the same structure
}

// Create context with default value
const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  colors: Colors.dark,
});

// Props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeType;
}

// ThemeProvider component
export const ThemeProvider = ({
  children,
  theme = "dark",
}: ThemeProviderProps) => {
  const value = {
    theme,
    colors: theme === "dark" ? Colors.dark : Colors.light,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to consume the theme
export const useTheme = () => useContext(ThemeContext);
