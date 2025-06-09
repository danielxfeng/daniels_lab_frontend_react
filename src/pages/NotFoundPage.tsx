import MotionTextButtonLink from '@/components/motion_components/MotionTextButtonLink';
import NotificationBar from '@/components/shared/NotificationBar';
import { useLocation } from 'react-router-dom';

// 404 page.
const NotFoundPage = () => {
  const location = useLocation();
  console.warn('404 warning', location.pathname);
  return (
    <div className='inner-container flex flex-col gap-4'>
      <NotificationBar />
      <h1>Oops! Page not found.</h1>

      <p>The page "{location.pathname}" does not exist.</p>

      {/** Link to go back to home. */}
      <MotionTextButtonLink
        to='/'
        label='Home'
        ariaLabel='Go back to home'
        isExternal={false}
        className='text-xl'
      />
    </div>
  );
};

export default NotFoundPage;
