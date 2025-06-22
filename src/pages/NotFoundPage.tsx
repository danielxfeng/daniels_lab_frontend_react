import { useLocation } from 'react-router-dom';

import MotionButton from '@/components/motion_components/MotionButton';
import NotificationBar from '@/components/shared/NotificationBar';

// 404 page.
const NotFoundPage = () => {
  const location = useLocation();
  console.warn('404 warning', location.pathname);
  return (
    <div className='inner-container flex flex-col gap-4 flex-grow items-center justify-center' data-role='not-found-page'>
      <NotificationBar />
      <h1>Oops! Page not found.</h1>

      <p>The page "{location.pathname}" does not exist.</p>

      {/** Link to go back to home. */}
      <MotionButton
        variant='highlight'
        size='md'
        supportingText='Go back to home'
        to='/'
        text='Home'
        isExternal={false}
        dataRole='button-go-home'
      />
    </div>
  );
};

export default NotFoundPage;
