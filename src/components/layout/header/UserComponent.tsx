import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import MotionButton from '@/components/motion_components/MotionButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { avatarAnimation } from '@/lib/animations';
import useUserStore from '@/stores/useUserStore';

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
  <Avatar className='mx-2 h-8 w-8'>
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
        btnClass='mx-2'
        dataRole='button-login'
      />
    );
  }

  // Show user avatar or username
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div className='flex items-center justify-center' {...avatarAnimation}>
          <Link to={`/user`}>
            <AvatarComponent
              name={user.username ?? 'User'}
              avatar={user.avatarUrl || undefined}
              firstChar={user.username?.[0]?.toUpperCase() ?? 'U'}
            />
          </Link>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>{'User profile'}</TooltipContent>
    </Tooltip>
  );
};

export default UserComponent;
