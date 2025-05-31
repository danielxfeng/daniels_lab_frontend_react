import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MotionH1 from '@/components/motion_components/MotionH1';
import { UserResponse } from '@/schema/schema_users';
import useUserStore from '@/stores/useUserStore';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { OauthProvider, OauthProviderValues } from '@/schema/schema_components';
import siteMeta from '@/constants/siteMeta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserLogoutComponent from '@/components/features/user_profile/UserLogoutComponent';
import UserProfileUpdateForm from '@/components/features/user_profile/UserProfileUpdateForm';
import UserDeleteComponent from '@/components/features/user_profile/UserDeleteComponent';
import UserPasswordUpdateForm from '@/components/features/user_profile/UserPasswordUpdateForm';
import MotionIconButton from '@/components/motion_components/MotionIconButton';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { oauthLinkUser, oauthUnlinkUser } from '@/services/service_auth';
import getDeviceId from '@/lib/deviceid';
import { OAuthConsentQuery, OAuthRedirectResponseSchema } from '@/schema/schema_auth';
import { useLocation } from 'react-router-dom';

const iconStyle = 'h-8 w-8 lg:h-12 lg:w-12';

const UserOauthLinkBar = ({
  user,
  deviceId,
}: {
  user: Partial<UserResponse>;
  deviceId: string;
}) => {
  const oauthMap = {
    google: <FaGoogle className={iconStyle} />,
    github: <FaGithub className={iconStyle} />,
    linkedin: <FaLinkedin className={iconStyle} />,
  };

  const [currentLoadingProvider, setCurrentLoadingProvider] = useState<OauthProvider | null>(null);
  const setUser = useUserStore.getState().setUser;
  const redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/user';

  const handleUnlinkClick = async (provider: OauthProvider) => {
    setCurrentLoadingProvider(provider);
    try {
      await oauthUnlinkUser(provider);
      toast.success(`Cool! ${provider} has been un-linked successfully.`);
      setUser({
        ...user,
        oauthProviders: user.oauthProviders?.filter((p) => p !== provider) as OauthProvider[],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to unlink ${provider}:`, error);
      const errMsg =
        error.response?.status === 422 ? ' : Cannot unlink the last provider.' : 'undefined';
      toast.error(`Failed to unlink ${provider} ${errMsg}`);
    } finally {
      setCurrentLoadingProvider(null);
    }
  };

  const handleLinkClick = async (provider: OauthProvider) => {
    setCurrentLoadingProvider(provider);
    try {
      const body: OAuthConsentQuery = {
        deviceId,
        redirectTo,
        consentAt: new Date().toISOString(),
      };
      const res = await oauthLinkUser(provider, body);
      const validatedRes = OAuthRedirectResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        console.error(
          `Failed to link ${provider}: Invalid response data`,
          JSON.stringify(validatedRes.error),
        );
        return toast.error(`Failed to link ${provider}, please try again later.`);
      }
      // Redirect to the OAuth provider's page
      window.location.href = validatedRes.data.redirectUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to link ${provider}:`, error);
      toast.error(`Failed to link ${provider}`);
    } finally {
      setCurrentLoadingProvider(null);
    }
  };

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <h2>Manage linked accounts</h2>
      <div className='flex gap-2'>
        {OauthProviderValues.map((provider) => {
          const isLinked = user.oauthProviders?.includes(provider);
          return (
            <div key={provider} className='flex items-center gap-2'>
              {isLinked ? (
                <MotionIconButton
                  icon={oauthMap[provider]}
                  onClick={() => handleUnlinkClick(provider)}
                  disabled={currentLoadingProvider === provider}
                  ariaLabel={`Unlink ${provider}`}
                  className='bg-muted text-muted-foreground'
                  tooltip={`Unlink ${provider}`}
                />
              ) : (
                <MotionIconButton
                  icon={oauthMap[provider]}
                  onClick={() => handleLinkClick(provider)}
                  disabled={currentLoadingProvider === provider}
                  ariaLabel={`Link ${provider}`}
                  tooltip={`Link ${provider}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * @summary UserProfilePage
 * @description
 * 1 - UserProfileCard: Displays the user profile information and a logout button.
 * 2 - UserProfileUpdateForm: A form to update the user profile information.
 * 3 - UserPasswordUpdateForm: A form to update the user password.
 * 4 - UserOauthLinkBar: A bar to link/unlink the user oauth providers.
 * 5 - UserDeleteComponent: A component to delete the user account.
 * 6 - The page is protected by the auth guard, so only authenticated users can access it.
 *
 * @remarks
 * As we can see, the user status may be changed by several components.
 * Therefore, we return null when the user is null.
 * So, please USE `<AtomicLogout to='/' timeout=1000 />` to logout the user.
 * @returns
 */
const UserProfilePage = () => {
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const errMsg = location.state?.error;
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Show error message from the location state
  // use useEffect to display only when the error message changes
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg, { duration: 5000 });
    }
  }, [errMsg]);

  // Get the device ID when the component mounts
  useEffect(() => {
    getDeviceId().then((id) => {
      setDeviceId(id);
    });
  }, []);

  return !user || !deviceId ? null : (
    <div className='inner-container'>
      <title>{`User Profile – ${siteMeta.siteName}`}</title>
      {/* UserProfileCard */}
      <div className='flex w-full items-center justify-between'>
        {/* User avatar and username */}
        <div className='flex items-center gap-5'>
          <Avatar className='h-16 w-16 items-center'>
            <AvatarImage
              src={user.avatarUrl ? user.avatarUrl : undefined}
              alt={`${user.username}'s avatar`}
            />
            <AvatarFallback>{user.username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
          </Avatar>
          <MotionH1>{user.username}</MotionH1>
        </div>
        {/* Logout button */}
        <div className='mx-5'>
          <UserLogoutComponent deviceId={deviceId} />
        </div>
      </div>

      <Tabs defaultValue='account' className='mx-auto mt-8 flex max-w-2xl'>
        <TabsList className='w-full'>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          {' '}
          <div className='flex w-full flex-col items-center gap-15'>
            <UserProfileUpdateForm />
            <UserDeleteComponent user={user!} />
          </div>
        </TabsContent>
        <TabsContent value='password'>
          <div className='flex w-full flex-col items-center gap-4'>
            <UserPasswordUpdateForm deviceId={deviceId} />
            <UserOauthLinkBar user={user!} deviceId={deviceId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
