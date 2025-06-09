import useUserStore from '@/stores/useUserStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocation } from 'react-router-dom';
import MotionButton from '@/components/motion_components/MotionButton';

// This component shows the user avatar or username.
const AvatarComponent = ({
  name,
  avatar,
  firstChar,
}: {
  name: string;
  avatar: string | undefined;
  firstChar: string;
}) => (
  <Avatar className='h-8 w-8'>
    <AvatarImage src={avatar} alt={`${name}'s avatar`} />
    <AvatarFallback>{firstChar}</AvatarFallback>
  </Avatar>
);

// A button that shows the user avatar or username, and links to the profile page.
// If the user is not authenticated, it shows a login button that links to the login page.
const UserComponent = () => {
  const user = useUserStore((s) => s.user); // Subscribe to the user state
  const location = useLocation(); // To optimize the login redirect
  const { getUserStatus } = useUserStore();

  const userStatus = getUserStatus();

  // Show login button if user is not authenticated
  if (userStatus === 'unauthenticated' || !user) {
    const currentPath = location.pathname + location.search;
    return (
      <MotionButton
        supportingText='Login'
        size='sm'
        variant='highlight'
        to={`/user/login?redirectTo=${encodeURIComponent(currentPath)}`}
        text='Login'
        isExternal={false}
      />
    );
  }

  // Show user avatar or username
  return (
    <AvatarComponent
      name={user.username ?? 'User'}
      avatar={user.avatarUrl || undefined}
      firstChar={user.username?.[0]?.toUpperCase() ?? 'U'}
    />
  );
};

export default UserComponent;
