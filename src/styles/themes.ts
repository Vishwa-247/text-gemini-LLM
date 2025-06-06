
import { ThemeColors } from '@/types/theme';

// Define theme colors
export const themes: Record<string, ThemeColors> = {
  // Dark theme (default)
  dark: {
    background: '222 47% 11%',
    foreground: '213 31% 91%',
    primary: '262 83% 58%',
    primaryForeground: '210 40% 98%',
    secondary: '222 47% 15%',
    secondaryForeground: '210 40% 98%',
    muted: '223 47% 20%',
    mutedForeground: '215 20% 65%',
    accent: '223 47% 20%',
    accentForeground: '210 40% 98%',
    destructive: '0 62% 50%',
    destructiveForeground: '210 40% 98%',
    border: '223 47% 20%',
    input: '223 47% 20%',
    ring: '224 71% 60%',
    sidebar: {
      background: '222 47% 9%',
      foreground: '213 31% 91%',
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      accent: '223 47% 13%',
      accentForeground: '213 31% 91%',
      border: '223 47% 13%',
      ring: '224 71% 60%',
    },
    chat: {
      user: '#343541',
      assistant: '#444654',
      hover: '#2A2B32',
    },
  },
  
  // Light theme
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    primary: '262 83% 58%',
    primaryForeground: '210 40% 98%',
    secondary: '210 40% 96%',
    secondaryForeground: '222 47% 11%',
    muted: '210 40% 96%',
    mutedForeground: '215 16% 47%',
    accent: '210 40% 96%',
    accentForeground: '222 47% 11%',
    destructive: '0 84% 60%',
    destructiveForeground: '210 40% 98%',
    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '262 83% 58%',
    sidebar: {
      background: '210 40% 98%',
      foreground: '222 47% 11%',
      primary: '262 83% 58%',
      primaryForeground: '0 0% 100%',
      accent: '210 40% 96%',
      accentForeground: '222 47% 11%',
      border: '214 32% 91%',
      ring: '262 83% 58%',
    },
    chat: {
      user: '#F7F7F8',
      assistant: '#FFFFFF',
      hover: '#ECECF1',
    }
  },
  
  // Cyberpunk theme
  cyberpunk: {
    background: '232 14% 13%',
    foreground: '0 0% 98%',
    primary: '326 100% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '266 100% 64%',
    secondaryForeground: '0 0% 100%',
    muted: '232 14% 20%',
    mutedForeground: '240 5% 64.9%',
    accent: '196 100% 50%',
    accentForeground: '0 0% 100%',
    destructive: '0 100% 50%',
    destructiveForeground: '0 0% 98%',
    border: '240 3.7% 15.9%',
    input: '240 3.7% 15.9%',
    ring: '326 100% 50%',
    sidebar: {
      background: '232 14% 10%',
      foreground: '0 0% 98%',
      primary: '326 100% 50%',
      primaryForeground: '0 0% 100%',
      accent: '196 100% 50%',
      accentForeground: '0 0% 100%',
      border: '240 3.7% 15.9%',
      ring: '326 100% 50%',
    },
    chat: {
      user: '#1a1a1e',
      assistant: '#2d2d39',
      hover: '#1a1a25',
    },
  },
  
  // Forest theme
  forest: {
    background: '158 23% 18%',
    foreground: '60 9% 98%',
    primary: '142 71% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '158 23% 23%',
    secondaryForeground: '60 9% 98%',
    muted: '158 23% 23%',
    mutedForeground: '60 9% 70%',
    accent: '84 59% 50%',
    accentForeground: '0 0% 100%',
    destructive: '0 62% 50%',
    destructiveForeground: '60 9% 98%',
    border: '158 23% 28%',
    input: '158 23% 28%',
    ring: '142 71% 45%',
    sidebar: {
      background: '158 23% 15%',
      foreground: '60 9% 98%',
      primary: '142 71% 45%',
      primaryForeground: '0 0% 100%',
      accent: '84 59% 50%',
      accentForeground: '0 0% 100%',
      border: '158 23% 28%',
      ring: '142 71% 45%',
    },
    chat: {
      user: '#213530',
      assistant: '#2c403b',
      hover: '#1a2a26',
    },
  },
  
  // Ocean theme
  ocean: {
    background: '205 50% 10%',
    foreground: '200 20% 96%',
    primary: '199 89% 48%',
    primaryForeground: '0 0% 100%',
    secondary: '205 50% 15%',
    secondaryForeground: '200 20% 96%',
    muted: '205 50% 15%',
    mutedForeground: '200 20% 70%',
    accent: '187 100% 42%',
    accentForeground: '0 0% 100%',
    destructive: '0 62% 50%',
    destructiveForeground: '200 20% 96%',
    border: '205 50% 20%',
    input: '205 50% 20%',
    ring: '199 89% 48%',
    sidebar: {
      background: '205 50% 8%',
      foreground: '200 20% 96%',
      primary: '199 89% 48%',
      primaryForeground: '0 0% 100%',
      accent: '187 100% 42%',
      accentForeground: '0 0% 100%',
      border: '205 50% 20%',
      ring: '199 89% 48%',
    },
    chat: {
      user: '#0f1b26',
      assistant: '#182635',
      hover: '#0d1620',
    },
  }
};
