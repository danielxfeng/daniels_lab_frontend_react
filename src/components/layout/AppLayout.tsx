import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/header/Header';
import Loading from '@/components/shared/Loading';
import ToasterWithTheme from '@/components/shared/ToasterWithTheme';
import { TooltipProvider } from '@/components/ui/tooltip';
import useThemeStore from '@/stores/useThemeStore';

const AppLayout = () => {
  const theme = useThemeStore((s) => s.theme); // Subscribe to the theme state

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

  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header />
      <main className='outer-container flex flex-grow flex-col'>
        <Suspense fallback={<Loading />}>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </Suspense>
      </main>
      {/* Footer */}
      <Footer />
      <ToasterWithTheme />
    </div>
  );
};

export default AppLayout;
