import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import ToasterWithTheme from '@/components/ToasterWithTheme';

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
      <ToasterWithTheme />
    </div>
  );
};

export default AppLayout;
