import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';

const AppLayout = () => {
  return (
    <div className='flex bg-background text-foreground min-h-screen flex-col'>
      <Header />
      <main className='w-full h-full bg-amber-500 mx-auto flex-grow px-4 py-8 text-center'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
