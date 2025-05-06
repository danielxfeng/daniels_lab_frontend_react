import useThemeStore from '@/stores/useThemeStore';
import { Toaster } from 'sonner';

/**
 * @summary A component to add theme to the Toaster.
 * @returns A Toaster component with a light theme.
 */
const ToastWithTheme = () => {
  // Subscribe to the theme store to listen for theme changes
  const theme = useThemeStore((state) => state.theme);
  return <Toaster theme={theme} />;
};

export default ToastWithTheme;
