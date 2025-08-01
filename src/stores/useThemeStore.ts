import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeType = 'system' | 'light' | 'dark';

type ThemeState = {
  theme: ThemeType;
  setTheme: (nextTheme: ThemeType) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (nextTheme: ThemeType) => {
        set({ theme: nextTheme });
      },
    }),
    { name: 'theme' },
  ),
);

export default useThemeStore;

export type { ThemeType };
