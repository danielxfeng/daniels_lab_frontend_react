import useUserStore from '@/stores/useUserStore';
import { redirect } from 'react-router-dom';

/**
 * @summary Auth guard for protecting routes.
 * @description This function checks the user's authentication status.
 * If the user is unauthenticated, it redirects them to the login page.
 * @returns {null} Returns null if the user is authenticated.
 */
const authGuard = ({ request }: { request: Request }): null => {
  const userStatus = useUserStore.getState().getUserStatus();
  if (userStatus === 'unauthenticated') {
    const redirectTo = new URL(request.url).pathname;
    throw redirect(`/user/login?redirectTo=${redirectTo}`);
  }
  return null;
};

/**
 * @summary Admin guard for protecting admin routes.
 * @description This function checks if the user is authenticated and is an admin.
 * @returns {null} Returns null if the user is authenticated and is an admin.
 */
const adminGuard = ({ request }: { request: Request }): null => {
  const { getUserStatus, user } = useUserStore.getState();
  if (getUserStatus() === 'unauthenticated' || !user?.isAdmin) {
    const redirectTo = new URL(request.url).pathname;
    throw redirect(`/user/login?redirectTo=${redirectTo}`);
  }
  return null;
};

export { authGuard, adminGuard };
