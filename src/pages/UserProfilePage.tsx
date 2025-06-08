import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import getDeviceId from '@/lib/deviceid';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MotionH1 from '@/components/motion_components/MotionH1';
import useUserStore from '@/stores/useUserStore';
import siteMeta from '@/constants/siteMeta';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserProfileUpdateForm from '@/components/features/user_profile/UserProfileUpdateForm';
import UserDeleteComponent from '@/components/features/user_profile/UserDeleteComponent';
import UserPasswordUpdateForm from '@/components/features/user_profile/UserPasswordUpdateForm';
import UserOauthLinkBar from '@/components/features/user_profile/UserOauthLinkBar';
import UserPasswordInsertionForm from '@/components/features/user_profile/UserPasswordInsertionForm';
import MotionTextLink from '@/components/motion_components/MotionTextLink';
import NotificationBar from '@/components/shared/NotificationBar';
import UserLogoutComponent from '@/components/features/user_profile/UserLogoutComponent';

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
      <NotificationBar />
      {/* UserProfileCard */}
      <div className='flex w-full items-center justify-start gap-5'>
        {/* User avatar and username */}
        <Avatar className='h-16 w-16 items-center'>
          <AvatarImage
            src={user.avatarUrl ? user.avatarUrl : undefined}
            alt={`${user.username}'s avatar`}
          />
          <AvatarFallback>{user.username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        <MotionH1>{user.username}</MotionH1>
      </div>

      <Tabs defaultValue='account' className='mx-auto mt-8 flex max-w-2xl items-center'>
        <TabsList className='w-full mb-4'>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
          {user.isAdmin && <TabsTrigger value='admin'>Admin</TabsTrigger>}
        </TabsList>
        <TabsContent value='account' className='w-full lg:max-w-md'>
          {' '}
          <div className='flex w-full flex-col items-center gap-5'>
            <UserOauthLinkBar user={user} deviceId={deviceId} />
            <div className="w-full border-t border-border mt-4" />
            <UserProfileUpdateForm />
              <div className="w-full border-t border-border my-4" />
            <UserLogoutComponent deviceId={deviceId} />
            <UserDeleteComponent user={user} />
          </div>
        </TabsContent>
        <TabsContent value='password'>
          <div className='flex w-full flex-col items-center gap-4'>
            {user.hasPassword ? (
              <UserPasswordUpdateForm deviceId={deviceId} />
            ) : (
              <UserPasswordInsertionForm deviceId={deviceId} />
            )}
          </div>
        </TabsContent>
        {user.isAdmin && (
          <TabsContent value='admin'>
            <div className='my-10 flex w-full justify-center'>
              <MotionTextLink to='/user/admin' isExternal={false} label='-> Admin Panel' />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
