import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AppLayout = () => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8 text-center'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
