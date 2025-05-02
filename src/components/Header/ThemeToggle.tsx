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
  // It's convenient to use Zustand
  // Then we don't be trapped by the infinite loop.
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  // We need the useEffect hook to track the theme.
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
    />
  );
};
export default ThemeToggle;
