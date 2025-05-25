import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MotionH1 from '@/components/motion_components/MotionH1';
import { UserResponse } from '@/schema/schema_users';
import useUserStore from '@/stores/useUserStore';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { OauthProviderValues } from '@/schema/schema_components';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import siteMeta from '@/constants/siteMeta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserLogoutComponent from '@/components/features/user_profile/UserLogoutComponent';
import UserProfileUpdateForm from '@/components/features/user_profile/UserProfileUpdateForm';
import UserDeleteComponent from '@/components/features/user_profile/UserDeleteComponent';
import UserPasswordUpdateForm from '@/components/features/user_profile/UserPasswordUpdateForm';

const iconStyle = 'h-8 w-8 lg:h-12 lg:w-12';

const UserOauthLinkBar = ({ user }: { user: Partial<UserResponse> }) => {
  const oauthMap = {
    google: <FaGoogle className={iconStyle} />,
    github: <FaGithub className={iconStyle} />,
    linkedin: <FaLinkedin className={iconStyle} />,
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
                <MotionIconLink
                  icon={oauthMap[provider]}
                  to={`${siteMeta.apiUrl}/auth/unlink/${provider}`}
                  ariaLabel={`Unlink ${provider}`}
                  className='bg-muted text-muted-foreground'
                  tooltip={`Unlink ${provider}`}
                  isExternal={false}
                />
              ) : (
                <MotionIconLink
                  icon={oauthMap[provider]}
                  to={`${siteMeta.apiUrl}/auth/${provider}`}
                  ariaLabel={`Link ${provider}`}
                  tooltip={`Link ${provider}`}
                  isExternal={false}
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
  const user = useUserStore((state) => state.user);

  return !user ? null : (
    <div className='inner-container'>
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
          <UserLogoutComponent />
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
            <UserPasswordUpdateForm />
            <UserOauthLinkBar user={user!} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
