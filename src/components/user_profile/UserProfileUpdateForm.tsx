import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthResponse } from '@/schema/schema_auth';
import { UpdateUserBody, UpdateUserBodySchema, UserResponseSchema } from '@/schema/schema_users';
import { updateUser } from '@/services/service_user';
import MotionTextButton from '@/components/motion_components/MotionTextButton';

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

  console.log('Render: UserProfileUpdateForm');
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

export default UserProfileUpdateForm;
