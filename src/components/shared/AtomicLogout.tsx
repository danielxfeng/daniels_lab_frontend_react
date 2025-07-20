import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useUserStore from '@/stores/useUserStore';

/**
 * @summary AtomicLogout
 * @description
 * This component is used to log out the user, and
 * navigate to a different page after a specified timeout.
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
