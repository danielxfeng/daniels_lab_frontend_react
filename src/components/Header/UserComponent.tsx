import useUserStore from '@/stores/useUserStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn } from 'lucide-react';
import MotionIconLink from '../motion_components/MotionIconLink';

// This component shows the user avatar or username.
const AvatarComponent = ({
  avatar,
  firstChar,
}: {
  avatar: string | undefined;
  firstChar: string;
}) => (
  <Avatar className='h-10 w-10 md:h-12 md:w-12'>
    <AvatarImage src={avatar} />
    <AvatarFallback>{firstChar}</AvatarFallback>
  </Avatar>
);

// A button that shows the user avatar or username, and links to the profile page.
// If the user is not authenticated, it shows a login button that links to the login page.
const UserComponent = () => {
  const { getUserStatus, getUser } = useUserStore();

  const userStatus = getUserStatus();
  const user = getUser();

  // Show login button if user is not authenticated
  if (userStatus !== 'unauthenticated' || !user) {
    return (
      <MotionIconLink
        to='/Login'
        icon={<LogIn className='text-primary h-6 w-6' />}
        ariaLabel='Login'
        isExternal={false}
      />
    );
  }

  // Show user avatar or username
  return (
    <MotionIconLink
      to='/User'
      icon={
        <AvatarComponent
          avatar={user.avatarUrl || undefined}
          firstChar={user.username?.[0]?.toUpperCase() ?? 'U'}
        />
      }
      ariaLabel={user.username ?? 'User'}
      isExternal={false}
    />
  );
};

export default UserComponent;
