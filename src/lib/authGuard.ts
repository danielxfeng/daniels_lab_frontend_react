import { redirect } from 'react-router';

import useUserStore from '@/stores/useUserStore';

const authGuard = ({ request }: { request: Request }): null => {
  const userStatus = useUserStore.getState().getUserStatus();
  if (userStatus === 'unauthenticated') {
    const redirectTo = new URL(request.url).pathname;
    throw redirect(`/user/login?redirectTo=${redirectTo}`);
  }
  return null;
};

const adminGuard = ({ request }: { request: Request }): null => {
  const { getUserStatus, user } = useUserStore.getState();
  if (getUserStatus() === 'unauthenticated' || !user?.isAdmin) {
    const redirectTo = new URL(request.url).pathname;
    throw redirect(`/user/login?redirectTo=${redirectTo}`);
  }
  return null;
};

export { adminGuard, authGuard };
