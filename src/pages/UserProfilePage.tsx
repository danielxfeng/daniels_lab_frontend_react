import LazyImage from '@/components/LazyImage';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionIconButton from '@/components/motion_components/MotionIconButton';
import {
  UpdateUserBody,
  UpdateUserBodySchema,
  UserResponse,
  UserResponseSchema,
} from '@/schema/schema_users';
import { updateUser } from '@/services/service_user';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import getDeviceId from '@/lib/deviceid';
import { changePassword, deleteUser, logoutUser } from '@/services/service_auth';
import {
  AuthResponse,
  AuthResponseSchema,
  ChangePasswordBody,
  ChangePasswordBodySchema,
  DeviceIdBodySchema,
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

// To display the user profile
const UserProfileCard = ({ user }: { user: Partial<AuthResponse> }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // A function to handle the logout
  const logoutHandler = async (isAll: boolean) => {
    const clear = useUserStore.getState().clear;
    setLoading(true);
    // We use deviceId to identify the device
    const body = isAll ? { deviceId: undefined } : { deviceId: await getDeviceId() };
    const validatedBody = DeviceIdBodySchema.safeParse(body);
    // Validate the req, fallback to logout all devices
    if (!validatedBody.success) {
      console.error('Invalid deviceId:', JSON.stringify(validatedBody.error));
      body.deviceId = undefined;
    }

    try {
      return await logoutUser(body);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error logging out:', error.response?.statusText);
      return;
    } finally {
      clear(); // Clear the user store
      toast.success('Logout successful');
      setLoading(false);
      setTimeout(() => navigate('/'), 1000);
    }
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-2'>
        {user.avatarUrl && (
          <LazyImage src={user.avatarUrl} alt='User Avatar' className='h-16 w-16 rounded-full' />
        )}
        <div>{user.username}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MotionIconButton
            icon={<LogOut className='h-5 w-5' />}
            ariaLabel='Logout'
            type='button'
            className='bg-muted text-muted-foreground w-fit'
            tooltip='Logout'
            isLoading={loading}
            disabled={loading}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logoutHandler(false)}>
            Logout current device
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logoutHandler(true)}>
            Logout all devices
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Form values for user profile update
const UserProfileUpdateForm = ({
  user,
  setUser,
}: {
  user: Partial<AuthResponse>;
  setUser: (user: Partial<AuthResponse>) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateUserBody>({
    resolver: zodResolver(UpdateUserBodySchema),
    mode: 'onTouched',
    defaultValues: {
      username: user.username,
      avatarUrl: user.avatarUrl || '',
    },
  });

  const onSubmit = async (data: UpdateUserBody) => {
    try {
      const res = await updateUser(data);
      const validatedUserProfile = UserResponseSchema.safeParse(res.data);
      if (!validatedUserProfile.success) {
        console.error('Invalid user profile response:', JSON.stringify(validatedUserProfile.error));
        return;
      }
      toast.success('User profile updated successfully');
      // Update the user store
      setUser({
        ...user,
        avatarUrl: validatedUserProfile.data.avatarUrl,
        username: validatedUserProfile.data.username,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating user profile:', error.response?.statusText);
      toast.error('Error updating user profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <fieldset className='border p-4' disabled={isSubmitting}>
        <div>
          <label htmlFor='username' className='mb-1 block text-sm font-medium'>
            Username
          </label>
          <input
            id='username'
            {...register('username')}
            className='input input-bordered w-full'
            placeholder='A new username'
          />
          {errors.username && (
            <p className='text-destructive mt-1 text-sm'>{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor='avatarUrl' className='mb-1 block text-sm font-medium'>
            Avatar URL <span>(optional)</span>
          </label>
          <input
            id='avatarUrl'
            {...register('avatarUrl')}
            className='input input-bordered w-full'
            placeholder='https://your.avatar.url'
          />
          {errors.avatarUrl && (
            <p className='text-destructive mt-1 text-sm'>{errors.avatarUrl.message}</p>
          )}
        </div>

        <MotionTextButton
          label='Update'
          ariaLabel='Update'
          type='submit'
          className='btn-primary'
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        />
      </fieldset>
    </form>
  );
};

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

const UserProfilePage = () => {
  const { user, setUser, setAccessToken, clear } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
    setAccessToken: state.setAccessToken,
    clear: state.clear,
  }));

  return (
    <div className='inner-container'>
      <MotionH1>User Profile</MotionH1>
      <UserProfileCard user={user!} />
      <UserProfileUpdateForm user={user!} setUser={setUser} />
      <UserPasswordUpdateForm setUser={setUser} setAccessToken={setAccessToken} />
      <UserOauthLinkBar user={user!} />
      <UserDeleteComponent user={user!} clear={clear} />
    </div>
  );
};

export default UserProfilePage;
