import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import MotionInput from '@/components/motion_components/MotionInput';
import AtomicLogout from '@/components/shared/AtomicLogout';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import logError from '@/lib/logError';
import {
  AuthResponseSchema,
  ChangePasswordBody,
  ChangePasswordBodySchema,
} from '@/schema/schema_auth';
import { changePassword } from '@/services/service_auth';

/**
 * @summary UserPasswordUpdateForm
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
        logError(validated.error, 'Invalid user response');
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
        logError(err, 'Error changing password');
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-6 w-full max-w-xl'
        data-role='user-password-update-form'
        aria-label='User Password Update Form'
      >
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* current password */}
          <FormField
            control={form.control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <MotionInput
                    type='password'
                    placeholder='Current password'
                    {...field}
                    data-role='input-current-password'
                    autoComplete='current-password'
                  />
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
                  <MotionInput
                    type='password'
                    placeholder='New password'
                    {...field}
                    data-role='input-new-password'
                    autoComplete='new-password'
                  />
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
                  <MotionInput
                    type='password'
                    placeholder='Confirm new password'
                    {...field}
                    data-role='confirm-password'
                    autoComplete='new-password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit button */}
          <MotionButton
            buttonType='submit'
            text='Update Password'
            supportingText='Update your password'
            variant='highlight'
            isFullWidth={true}
            size='md'
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            dataRole='button-submit-update-password'
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default UserPasswordUpdateForm;
