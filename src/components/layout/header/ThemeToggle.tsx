import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

import MotionButton from '@/components/motion_components/MotionButton';
import useThemeStore, { ThemeType } from '@/stores/useThemeStore';

const className = 'text-primary h-6 w-6';

const setHtmlTheme = (theme: ThemeType) => {
  const html = document.documentElement;
  switch (theme) {
    case 'dark':
      html.setAttribute('data-theme', 'dark');
      break;
    case 'light':
      html.setAttribute('data-theme', 'light');
      break;
    default:
      html.removeAttribute('data-theme');
  }
};

// This component is a button that toggles the theme between light, dark, and system.
const ThemeToggle = () => {
  const theme = useThemeStore((s) => s.theme); // Subscribe to the theme state
  const toggleTheme = useThemeStore.getState().toggleTheme;

  useEffect(() => {
    setHtmlTheme(theme);
  }, [theme]);

  const icon = {
    light: <Sun className={className} />,
    dark: <Moon className={className} />,
    system: <Sun className={className} />, // Default icon for system theme
  }[theme];

  return (
    <MotionButton
      supportingText='Toggle Theme'
      size='sm'
      variant='secondary'
      buttonType='button'
      icon={icon}
      onClick={toggleTheme}
      dataRole='button-theme-toggle'
    />
  );
};
export default ThemeToggle;
