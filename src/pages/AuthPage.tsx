import Loading from '@/components/shared/Loading';
import getDeviceId from '@/lib/deviceid';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import { AuthResponseSchema } from '@/schema/schema_auth';
import { oauthGetUserInfo } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @summary AuthPage Component
 * @description
 * This is not a normal page.
 * To handle the callback logic of the social media login pipelines.
 * It performs some logic by the redirected URL, then redirects the user to the appropriate page.
 *
 * Tries to parse the redirected URL, extracts the accessToken, and user information.
 * It redirects the user to home page after successful login, or back to login page if failed.
 * @return return null when getting a result, otherwise returns a loading component.
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useUserStore.getState();

  // For successful login, the accessToken is in `hash`.
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('accessToken');
  const params = new URLSearchParams(window.location.search);
  const errMsg = params.get('error') || 'Unknown error';

  console.log('AuthPage: Access token:', accessToken, 'Error message:', errMsg);

  useEffect(() => {
    // For failed login.
    if (!accessToken) {
      console.error('AuthPage: No access token found in URL:', errMsg);
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
          return throwWithValidationErr(
            'AuthPage: Invalid user info',
            JSON.stringify(validatedUserInfo.error),
          );
        }

        // Set the accessToken and user info to the store.
        setAccessToken(accessToken);
        setUser(userInfo.data);

        // Redirect to home page after successful login.
        navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('AuthPage: Failed to get user info:', error);
        navigate('/user/login', { state: { error: 'Unknown error, please try again later' } });
        return null;
      }
    };

    successfulLoginFunc();
  }, [accessToken, errMsg, navigate, setAccessToken, setUser]); // To mute the linter.

  // For successful login.

  return <Loading />;
};

export default AuthPage;
