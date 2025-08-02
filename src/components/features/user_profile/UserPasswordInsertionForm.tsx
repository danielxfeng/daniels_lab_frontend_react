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
import { AuthResponseSchema, SetPasswordBody, SetPasswordBodySchema } from '@/schema/schema_auth';
import { UserResponse } from '@/schema/schema_users';
import { setPassword } from '@/services/service_auth';

/**
 * @summary UserPasswordInsertionForm
 */
const UserPasswordInsertionForm = ({
  deviceId,
  user,
}: {
  deviceId: string;
  user: Partial<UserResponse>;
}) => {
  const [doLogout, setDoLogout] = useState<boolean>(false);

  // Init the form
  const form = useForm<SetPasswordBody>({
    resolver: zodResolver(SetPasswordBodySchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
      deviceId,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: SetPasswordBody) => {
    try {
      const res = await setPassword(data);
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
      logError(err, 'Error updating password');
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
        data-role='user-password-insertion-form'
        aria-label='User Password Insertion Form'
      >
        <input
          type='text'
          name='username'
          value={user.username}
          autoComplete='username'
          readOnly
          hidden
        />

        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* new password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <MotionInput
                    type='password'
                    placeholder='password'
                    {...field}
                    data-role='input-password'
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
                    placeholder='Confirm password'
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
            text='Set Password'
            supportingText='Set Password'
            variant='highlight'
            isFullWidth={true}
            size='md'
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            dataRole='button-submit-set-password'
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default UserPasswordInsertionForm;
