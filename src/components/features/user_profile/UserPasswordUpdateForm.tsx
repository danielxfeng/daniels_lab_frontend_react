import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  AuthResponseSchema,
  ChangePasswordBody,
  ChangePasswordBodySchema,
} from '@/schema/schema_auth';
import { changePassword } from '@/services/service_auth';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import AtomicLogout from '@/components/shared/AtomicLogout';
import MotionInput from '@/components/motion_components/MotionInput';

/**
 * @summary UserPasswordUpdateForm
 * @description
 * This component provides a form for users to update their password.
 * It includes fields for the current password, new password,
 * and confirmation of the new password.
 * It handles form submission, validation, and error handling.
 *
 * It logs out the user after a successful password change,
 */
const UserPasswordUpdateForm = ({ deviceId }: { deviceId: string }) => {
  const [doLogout, setDoLogout] = useState<boolean>(false);

  // Init the form
  const form = useForm<ChangePasswordBody>({
    resolver: zodResolver(ChangePasswordBodySchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
      deviceId,
    },
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: ChangePasswordBody) => {
    try {
      const res = await changePassword(data);
      const validated = AuthResponseSchema.safeParse(res.data);
      if (!validated.success) {
        console.error('Invalid user response:', JSON.stringify(validated.error));
        return;
      }
      toast.success('Password updated successfully');
      reset(); // Reset the form fields
      setDoLogout(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
      } else {
        console.error('Error changing password:', err.response?.statusText);
        toast.error('Error changing password, please try again later');
      }
      form.setValue('currentPassword', '');
      form.setValue('password', '');
      form.setValue('confirmPassword', '');
    }
  };

  return (
    <Form {...form}>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 w-full max-w-xl'>
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* current password */}
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <MotionInput type='password' placeholder='Current password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* new password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <MotionInput type='password' placeholder='New password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* confirm password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <MotionInput type='password' placeholder='Confirm new password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit button */}
          <MotionTextButton
            type='submit'
            label='Update Password'
            ariaLabel='Update Password'
            className='btn-primary'
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default UserPasswordUpdateForm;
