import useUserStore from '@/stores/useUserStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @summary AtomicLogout
 * @description
 * This component is used to log out the user, and
 * navigate to a different page after a specified timeout.
 * @param to - The path to navigate to after logout.
 * @param timeout - The time in milliseconds to wait before navigating.
 * @returns
 */
const AtomicLogout = ({ to, timeout }: { to: string; timeout: number }) => {
  const navigate = useNavigate();
  const clear = useUserStore.getState().clear;

  useEffect(() => {
    const timer = setTimeout(() => {
      clear();
      navigate(to);
    }, timeout);
    return () => clearTimeout(timer);
  }, [navigate, to, timeout, clear]);

  return null;
};

export default AtomicLogout;
