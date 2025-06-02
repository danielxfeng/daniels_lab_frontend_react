import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import useUserStore from '@/stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import StyledInput from '@/components/shared/StyledInput';

/**
 * @summary UserProfileUpdateForm
 * @description
 * To update the user name and avatar URL.
 * It redirects the user to the home page after a successful update.
 * We need this, otherwise the user will see another form with new values,
 * which is weird.
 */
const UserProfileUpdateForm = () => {
  const { user, setUser } = useUserStore.getState();
  const navigate = useNavigate();

  // Init the form
  const form = useForm<UpdateUserBody>({
    resolver: zodResolver(UpdateUserBodySchema),
    mode: 'onTouched',
    defaultValues: {
      username: user?.username,
    },
  });

  const {
    setError,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

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

      // Note: about the order:
      // 1. clear the form values, only the inputs will be re-rendered.
      // 2. set the user store, does not trigger a re-render since we use the snapshot.
      // 3. show a success message.
      // 4. redirect to home page.
      // By this way, we try to give a clear user experience.

      // Clear the values
      setValue('username', '');

      // Update the user store with the new user profile
      setUser({
        ...user!,
        username: validatedUserProfile.data.username,
      });

      // Send a message
      toast.success('User profile updated successfully');

      // Redirect to home page
      setTimeout(() => {
        navigate('/');
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError('username', {
          type: 'manual',
          message: 'Username already exists',
        });
        return;
      }
      console.error('Error updating user profile:', error.response?.statusText);
      toast.error('Error updating user profile');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 w-full max-w-xl'>
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* Username is required */}
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <StyledInput placeholder='A new username' {...field} />
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
