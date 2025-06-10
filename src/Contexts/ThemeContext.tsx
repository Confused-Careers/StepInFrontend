import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Simplified to only use dark mode
type Theme = "dark";
interface ThemeContextType {
  theme: Theme;
  // Keeping the setTheme function for future flexibility
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  // Always using dark theme
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    
    // Still storing the theme for consistency
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // No need for system theme detection since we're only using dark mode
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      // This is a no-op function as we're only supporting dark mode for now
      setTheme: () => {}
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/* 
  COMMENTED OUT CODE FOR FUTURE REFERENCE:
  
  // Original theme type
  // type Theme = "light" | "dark" | "system";
  
  // Code for handling system theme
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  //   const handleChange = () => {
  //     if (theme === "system") {
  //       const newSystemTheme = mediaQuery.matches ? "dark" : "light";
  //       window.document.documentElement.classList.remove("light", "dark");
  //       window.document.documentElement.classList.add(newSystemTheme);
  //     }
  //   };

  //   mediaQuery.addEventListener("change", handleChange);
  //   return () => mediaQuery.removeEventListener("change", handleChange);
  // }, [theme]);
  
  // Original theme state initialization
  // const [theme, setTheme] = useState<Theme>(() => {
  //   const storedTheme = localStorage.getItem(storageKey) as Theme;
  //   return storedTheme || defaultTheme;
  // });
*/