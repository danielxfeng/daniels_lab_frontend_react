import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeType = 'system' | 'light' | 'dark';

type ThemeState = {
  /* properties */
  theme: ThemeType;
  /**
   * @summary Toggle the theme.
   * @description It sets the theme the next one.
   * @param theme The theme to set.
   */
  toggleTheme: () => void;
};

/**
 * @summary A Zustand store for managing the theme.
 * @description Here we maintain the current theme.
 * It allows setting and getting the theme.
 */
const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      toggleTheme: () => {
        const currentTheme = get().theme;
        let nextTheme: ThemeType;
        switch (currentTheme) {
          case 'system':
            nextTheme = 'light';
            break;
          case 'light':
            nextTheme = 'dark';
            break;
          case 'dark':
            nextTheme = 'system';
            break;
          default:
            nextTheme = 'system';
        }
        set({ theme: nextTheme });
      },
    }),
    { name: 'theme' },
  ),
);
export default useThemeStore;

export type { ThemeType };
