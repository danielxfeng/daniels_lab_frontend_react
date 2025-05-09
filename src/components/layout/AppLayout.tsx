import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/shared/Loading';
import ToasterWithTheme from '@/components/shared/ToasterWithTheme';
import { TooltipProvider } from '@/components/ui/tooltip';

const AppLayout = () => {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header />
      <main className='outer-container flex-grow'>
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
