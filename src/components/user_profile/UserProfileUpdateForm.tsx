import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AuthResponse } from '@/schema/schema_auth';
import { UpdateUserBody, UpdateUserBodySchema, UserResponseSchema } from '@/schema/schema_users';
import { updateUser } from '@/services/service_user';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import AtomicLogout from '../AtomicLogout';

/**
 * @summary UserProfileUpdateForm
 * @description To update the user name and avatar URL.
 * @param user - The user object containing the current user data.
 * @returns
 */
const UserProfileUpdateForm = ({
  user,
}: {
  user: Partial<AuthResponse>;
  setUser: (user: Partial<AuthResponse>) => void;
}) => {
  // Ensure atomic logout
  const [doLogout, setDoLogout] = useState<boolean>(false);

  // Init the form
  const form = useForm<UpdateUserBody>({
    resolver: zodResolver(UpdateUserBodySchema),
    mode: 'onTouched',
    defaultValues: {
      username: user.username,
      avatarUrl: user.avatarUrl || '',
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const avatarUrl = watch('avatarUrl');

  useEffect(() => {
    if (avatarUrl === '') {
      setValue('avatarUrl', undefined);
    }
  }, [avatarUrl, setValue]);

  // The submit handler
  const onSubmit = async (data: UpdateUserBody) => {
    try {
      const res = await updateUser(data);

      // Validate the response
      const validatedUserProfile = UserResponseSchema.safeParse(res.data);
      if (!validatedUserProfile.success) {
        console.error('Invalid user profile response:', JSON.stringify(validatedUserProfile.error));
        return;
      }

      // Perform the success action
      toast.success('User profile updated successfully');
      setDoLogout(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating user profile:', error.response?.statusText);
      toast.error('Error updating user profile');
    }
  };

  return (
    <Form {...form}>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      <form onSubmit={handleSubmit(onSubmit)} className='mx-auto mt-6 max-w-xl'>
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* Username is required */}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='A new username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Avatar URL is optional */}
          <FormField
            control={form.control}
            name='avatarUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Avatar URL <span className='text-muted-foreground italic'>(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='https://your.avatar.url' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
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
    </Form>
  );
};

export default UserProfileUpdateForm;
