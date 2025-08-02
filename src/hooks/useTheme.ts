import { useEffect } from 'react';

import useThemeStore from '@/stores/useThemeStore';

const useTheme = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const sysSetting = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'system')
        root.setAttribute('data-theme', sysSetting.matches ? 'dark' : 'light');
      else root.setAttribute('data-theme', theme);
    };

    applyTheme();

    if (theme === 'system') {
      sysSetting.addEventListener('change', applyTheme);
      return () => sysSetting.removeEventListener('change', applyTheme);
    }
  }, [theme]);
};

export default useTheme;
