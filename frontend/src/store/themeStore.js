import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: true, // Always dark mode
      
      // Remove toggle functionality - theme is always dark
      toggleTheme: () => {
        // No-op function to maintain compatibility
        return;
      },
      
      initializeTheme: () => {
        // Always set dark mode
        document.documentElement.classList.add('dark');
        set({ isDarkMode: true });
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);