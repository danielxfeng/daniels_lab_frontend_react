import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import MotionInput from '@/components/motion_components/MotionInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import logError from '@/lib/logError';
import { UpdateUserBody, UpdateUserBodySchema, UserResponseSchema } from '@/schema/schema_users';
import { updateUser } from '@/services/service_user';
import useUserStore from '@/stores/useUserStore';

/**
 * @summary UserProfileUpdateForm
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
        logError(validatedUserProfile.error, 'Invalid user profile response');
        return;
      }

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
      logError(error, 'Error updating user profile');
      toast.error('Error updating user profile');
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <h3>Update your profile</h3>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-6 w-full max-w-xl'
          data-role='user-profile-update-form'
          aria-label='User Profile Update Form'
        >
          <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
            {/* Username is required */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <MotionInput
                      placeholder='A new username'
                      {...field}
                      data-role='input-username'
                      autoComplete='off'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <MotionButton
              variant='highlight'
              size='md'
              isFullWidth={true}
              text='Update'
              supportingText='Update'
              buttonType='submit'
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              dataRole='button-submit-update-profile'
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileUpdateForm;
