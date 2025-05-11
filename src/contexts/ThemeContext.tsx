
import * as React from 'react';
import { ThemeOption, ThemeColors } from '@/types/theme';
import { themes } from '@/styles/themes';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  colors: ThemeColors;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<ThemeOption>('dark');
  
  // Apply theme colors to CSS variables
  React.useEffect(() => {
    const colors = themes[theme] || themes.dark;
    
    // Apply root variables
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--foreground', colors.foreground);
    document.documentElement.style.setProperty('--primary', colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', colors.primaryForeground);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    document.documentElement.style.setProperty('--muted', colors.muted);
    document.documentElement.style.setProperty('--muted-foreground', colors.mutedForeground);
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--accent-foreground', colors.accentForeground);
    document.documentElement.style.setProperty('--destructive', colors.destructive);
    document.documentElement.style.setProperty('--destructive-foreground', colors.destructiveForeground);
    document.documentElement.style.setProperty('--border', colors.border);
    document.documentElement.style.setProperty('--input', colors.input);
    document.documentElement.style.setProperty('--ring', colors.ring);
    
    // Apply sidebar variables
    document.documentElement.style.setProperty('--sidebar-background', colors.sidebar.background);
    document.documentElement.style.setProperty('--sidebar-foreground', colors.sidebar.foreground);
    document.documentElement.style.setProperty('--sidebar-primary', colors.sidebar.primary);
    document.documentElement.style.setProperty('--sidebar-primary-foreground', colors.sidebar.primaryForeground);
    document.documentElement.style.setProperty('--sidebar-accent', colors.sidebar.accent);
    document.documentElement.style.setProperty('--sidebar-accent-foreground', colors.sidebar.accentForeground);
    document.documentElement.style.setProperty('--sidebar-border', colors.sidebar.border);
    document.documentElement.style.setProperty('--sidebar-ring', colors.sidebar.ring);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme-preference', theme);
  }, [theme]);
  
  // Load theme from localStorage on initial render
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && Object.keys(themes).includes(savedTheme)) {
      setTheme(savedTheme as ThemeOption);
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
