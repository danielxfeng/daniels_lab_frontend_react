import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

const AppLayout = () => {
  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      <Header />
      <main className='mx-auto h-full w-full flex-grow bg-amber-500 px-4 py-8 text-center'>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
