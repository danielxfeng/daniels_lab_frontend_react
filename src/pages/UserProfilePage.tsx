import MotionH1 from '@/components/motion_components/MotionH1';

import { UserResponse } from '@/schema/schema_users';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import getDeviceId from '@/lib/deviceid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { changePassword, deleteUser } from '@/services/service_auth';
import {
  AuthResponse,
  AuthResponseSchema,
  ChangePasswordBody,
  ChangePasswordBodySchema,
} from '@/schema/schema_auth';
import useUserStore from '@/stores/useUserStore';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import { OauthProviderValues } from '@/schema/schema_components';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import siteMeta from '@/constants/siteMeta';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserLogoutComponent from '@/components/user_profile/UserLogoutComponent';
import UserProfileUpdateForm from '@/components/user_profile/UserProfileUpdateForm';

// A component to update the user password
const UserPasswordUpdateForm = ({
  setUser,
  setAccessToken,
}: {
  setUser: (user: Partial<AuthResponse>) => void;
  setAccessToken: (token: string | null) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordBody>({
    resolver: zodResolver(ChangePasswordBodySchema),
    mode: 'onTouched',
  });

  console.log('Render: UserPasswordUpdateForm');

  useEffect(() => {
    getDeviceId().then((deviceId) => {
      setValue('deviceId', deviceId);
    });
  }, [setValue]);

  const onSubmit = async (data: ChangePasswordBody) => {
    try {
      const res = await changePassword(data);
      const validatedUser = AuthResponseSchema.safeParse(res.data);
      if (!validatedUser.success) {
        console.error('Invalid user response:', JSON.stringify(validatedUser.error));
        return;
      }
      setAccessToken(validatedUser.data.accessToken);
      setUser(validatedUser.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
      }
      console.error('Error changing password:', err.response?.statusText);
      toast.error('Error changing password, please try again later');
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <fieldset className='rounded-md border p-4' disabled={isSubmitting}>
        <div>
          <label htmlFor='currentPassword' className='mb-1 block text-sm font-medium'>
            Current Password
          </label>
          <input
            id='currentPassword'
            type='password'
            {...register('currentPassword')}
            className='input input-bordered w-full'
            placeholder='current password'
          />
          {errors.currentPassword && (
            <p className='text-destructive mt-1 text-sm'>
              {errors.currentPassword.message as string}
            </p>
          )}
        </div>

        <div>
          <label htmlFor='password' className='mb-1 block text-sm font-medium'>
            New Password
          </label>
          <input
            id='password'
            type='password'
            {...register('password')}
            className='input input-bordered w-full'
            placeholder='Input new password'
          />
          {errors.password && (
            <p className='text-destructive mt-1 text-sm'>{errors.password.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor='confirmPassword' className='mb-1 block text-sm font-medium'>
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            type='password'
            {...register('confirmPassword')}
            className='input input-bordered w-full'
            placeholder='Confirm password'
          />
          {errors.confirmPassword && (
            <p className='text-destructive mt-1 text-sm'>
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>

        <MotionTextButton
          type='submit'
          label='Update Password'
          ariaLabel='Update Password'
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        />
      </fieldset>
    </form>
  );
};

const UserOauthLinkBar = ({ user }: { user: Partial<UserResponse> }) => {
  const oauthMap = {
    google: <FaGoogle className='h-5 w-5' />,
    github: <FaGithub className='h-5 w-5' />,
    linkedin: <FaLinkedin className='h-5 w-5' />,
  };
  console.log('Render: UserOauthLinkBar');
  return (
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
  );
};

const UserDeleteComponent = ({
  user,
  clear,
}: {
  user: Partial<UserResponse>;
  clear: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id!);
      clear(); // Clear the user store
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
      return;
    } finally {
      setLoading(false);
    }
  };
  console.log('Render: UserDeleteComponent');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <MotionTextButton
          label='Delete Account'
          ariaLabel='Delete Account'
          type='button'
          className='btn-destructive'
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and all related
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler} disabled={loading}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  const { setUser, setAccessToken, clear } = useUserStore.getState();

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
          <div className='w-full flex flex-col gap-4 items-center'>
            <UserProfileUpdateForm user={user!} />
            <UserDeleteComponent user={user!} clear={clear} />
          </div>
        </TabsContent>
        <TabsContent value='password'>
          <div className='w-full flex flex-col gap-4 items-center'>
            <UserPasswordUpdateForm setUser={setUser} setAccessToken={setAccessToken} />
            <UserOauthLinkBar user={user!} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
