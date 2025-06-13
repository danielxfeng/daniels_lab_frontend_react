const Notification = () => (
  <div className='text-center text-sm'>
    <p>Welcome to our website! Check out our latest features.</p>
  </div>
);

// A notification bar is between the header and the main content of the page.
const NotificationBar = ({ isVisible = false }: { isVisible?: boolean }) => (
  <div className='flex h-10 w-full items-center justify-center lg:h-16'>
    {isVisible && <Notification />}
  </div>
);

export default NotificationBar;
