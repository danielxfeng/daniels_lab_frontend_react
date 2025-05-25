import useUserStore from '@/stores/useUserStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn } from 'lucide-react';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import { useLocation } from 'react-router-dom';

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
  <Avatar className='h-10 w-10 lg:h-12 lg:w-12'>
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
      <MotionIconLink
        to={`/user/login?redirectTo=${encodeURIComponent(currentPath)}`}
        icon={<LogIn className='text-primary h-6 w-6' />}
        ariaLabel='Login'
        isExternal={false}
        tooltip='Login'
      />
    );
  }

  // Show user avatar or username
  return (
    <MotionIconLink
      to='/User'
      icon={
        <AvatarComponent
          name={user.username ?? 'User'}
          avatar={user.avatarUrl || undefined}
          firstChar={user.username?.[0]?.toUpperCase() ?? 'U'}
        />
      }
      ariaLabel={user.username ?? 'User'}
      isExternal={false}
      tooltip='User Profile'
    />
  );
};

export default UserComponent;
