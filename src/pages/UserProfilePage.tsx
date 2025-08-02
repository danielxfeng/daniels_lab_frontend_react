import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import UserDeleteComponent from '@/components/features/user_profile/UserDeleteComponent';
import UserLogoutComponent from '@/components/features/user_profile/UserLogoutComponent';
import UserOauthLinkBar from '@/components/features/user_profile/UserOauthLinkBar';
import UserPasswordInsertionForm from '@/components/features/user_profile/UserPasswordInsertionForm';
import UserPasswordUpdateForm from '@/components/features/user_profile/UserPasswordUpdateForm';
import UserProfileUpdateForm from '@/components/features/user_profile/UserProfileUpdateForm';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionTextLink from '@/components/motion_components/MotionTextLink';
import NotificationBar from '@/components/shared/NotificationBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import siteMeta from '@/constants/siteMeta';
import { authGuard } from '@/lib/authGuard';
import getDeviceId from '@/lib/deviceid';
import useUserStore from '@/stores/useUserStore';

const clientLoader = async ({ request }: { request: Request }) => {
  return authGuard({ request });
};

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
    <div className='inner-container' data-role='user-profile-page'>
      <title>{`User Profile – ${siteMeta.siteName}`}</title>
      <NotificationBar />
      {/* UserProfileCard */}
      <MotionH1 className='flex items-center justify-start gap-5 text-start'>
        <Avatar className='h-16 w-16 items-center'>
          <AvatarImage
            src={user.avatarUrl ? user.avatarUrl : undefined}
            alt={`${user.username}'s avatar`}
          />
          <AvatarFallback>{user.username?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
        </Avatar>
        {user.username}
      </MotionH1>

      <Tabs defaultValue='account' className='mx-auto mt-8 flex max-w-2xl items-center'>
        <TabsList className='mb-4 w-full'>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
          {user.isAdmin && <TabsTrigger value='admin'>Admin</TabsTrigger>}
        </TabsList>
        <TabsContent value='account' className='w-full lg:max-w-md'>
          {' '}
          <div className='flex w-full flex-col items-center gap-5'>
            <UserOauthLinkBar user={user} deviceId={deviceId} />
            <div className='border-border mt-4 w-full border-t' />
            <UserProfileUpdateForm />
            <div className='border-border my-4 w-full border-t' />
            <UserLogoutComponent deviceId={deviceId} />
            <UserDeleteComponent user={user} />
          </div>
        </TabsContent>
        <TabsContent value='password' className='w-full lg:max-w-md'>
          <div className='flex w-full flex-col items-center gap-4'>
            {user.hasPassword ? (
              <UserPasswordUpdateForm deviceId={deviceId} />
            ) : (
              <UserPasswordInsertionForm deviceId={deviceId} />
            )}
          </div>
        </TabsContent>
        {user.isAdmin && (
          <TabsContent value='admin' className='w-full lg:max-w-md'>
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

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };
