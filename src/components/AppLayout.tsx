import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import Loading from './Loading';
import { Toaster } from 'sonner';

const AppLayout = () => {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header />
      <main className='outer-container flex-grow'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
};

export default AppLayout;
