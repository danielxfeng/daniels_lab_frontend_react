'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import Loading from '@/components/shared/Loading';
import getDeviceId from '@/lib/deviceid';
import logError from '@/lib/logError';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import { AuthResponseSchema } from '@/schema/schema_auth';
import { oauthGetUserInfo } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';

/**
 * @summary AuthPage Component
 * @description
 * To handle the callback logic of the social media login pipelines.
 * @return return null when getting a result, otherwise returns a loading component.
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useUserStore.getState();

  // For successful login, the accessToken is in `hash`.
  let accessToken = null;
  let redirectTo = '/';
  let errMsg = 'Unknown error';

  if (typeof window !== 'undefined') {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    accessToken = hashParams.get('accessToken');
    redirectTo = hashParams.get('redirectTo') || '/';
    const params = new URLSearchParams(window.location.search);
    errMsg = params.get('error') || 'Unknown error';
  }

  useEffect(() => {
    // For user already exists.
    if (errMsg === 'user_already_exists') {
      navigate('/user', { state: { error: errMsg } });
      return;
    }

    // For failed login.
    if (!accessToken) {
      logError(errMsg, 'AuthPage: No access token found in URL');
      navigate('/user/login', { state: { error: errMsg } });
      return;
    }

    // Function for successful login with accessToken.
    const successfulLoginFunc = async () => {
      try {
        // Try to fetch user info with the accessToken.
        const userInfo = await oauthGetUserInfo(accessToken, await getDeviceId());
        const validatedUserInfo = AuthResponseSchema.safeParse(userInfo.data);
        if (!validatedUserInfo.success) {
          return throwWithValidationErr('AuthPage: Invalid user info', validatedUserInfo.error);
        }

        toast.success('Login successful');

        // Set the accessToken and user info to the store.
        setAccessToken(accessToken);
        setUser(userInfo.data);

        // Redirect to the specified page or home page.
        navigate(redirectTo, { replace: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logError(error, 'AuthPage: Failed to get user info');
        navigate('/user/login', { state: { error: 'Unknown error, please try again later' } });
      }
    };

    successfulLoginFunc();
  }, [accessToken, errMsg, navigate, redirectTo, setAccessToken, setUser]); // To mute the linter.

  // For successful login.

  return <Loading />;
};

export default AuthPage;
