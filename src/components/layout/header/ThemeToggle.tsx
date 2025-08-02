import { Monitor, Moon, Sun } from 'lucide-react';

import MotionButton from '@/components/motion_components/MotionButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useThemeStore from '@/stores/useThemeStore';

const className = 'text-primary h-6 w-6';

// This component is a button that toggles the theme between light, dark, and system.
const ThemeToggle = () => {
  const theme = useThemeStore((s) => s.theme); // Subscribe to the theme state
  const setTheme = useThemeStore.getState().setTheme;

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const btns = [
    { value: 'system' as const, icon: <Monitor className={className} /> },
    { value: 'light' as const, icon: <Sun className={className} /> },
    { value: 'dark' as const, icon: <Moon className={className} /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MotionButton
          supportingText='Toggle Theme'
          size='sm'
          variant='secondary'
          buttonType='button'
          icon={isDark ? <Sun className={className} /> : <Moon className={className} />}
          dataRole='button-theme-toggle'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='border-muted flex justify-between' align='end' sideOffset={4}>
        {btns.map((btn) => (
          <DropdownMenuItem key={btn.value} onClick={() => setTheme(btn.value)}>
            <MotionButton
              supportingText={btn.value}
              size='sm'
              variant='secondary'
              buttonType='button'
              icon={btn.icon}
              onClick={() => setTheme(btn.value)}
              dataRole={`button-theme-toggle-${btn.value}`}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ThemeToggle;
