import { useEffect } from 'react';
import { Sun, Moon, SunMoon } from 'lucide-react';
import MotionIconButton from '../motion_components/MotionIconButton';
import useThemeStore, { ThemeType } from '@/stores/useThemeStore';

const className = 'text-primary h-6 w-6';

// A helper function to set the HTML theme attribute.
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
  const toggleTheme  = useThemeStore.getState().toggleTheme;

  // We need the useEffect hook to handle the side effect.
  useEffect(() => {
    setHtmlTheme(theme);
  }, [theme]);

  const icon = {
    system: <SunMoon className={className} />,
    light: <Sun className={className} />,
    dark: <Moon className={className} />,
  }[theme];

  return (
    <MotionIconButton
      icon={icon}
      ariaLabel='Toggle Theme'
      type='button'
      onClick={toggleTheme}
      tooltip='Toggle Theme'
    />
  );
};
export default ThemeToggle;
