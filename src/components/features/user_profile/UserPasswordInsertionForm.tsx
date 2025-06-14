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
import { AuthResponseSchema, SetPasswordBody, SetPasswordBodySchema } from '@/schema/schema_auth';
import { setPassword } from '@/services/service_auth';

/**
 * @summary UserPasswordInsertionForm
 * @description
 * This component provides a form for users to add a password.
 * It's designed for a oauth user who doesn't have a password set yet.
 */
const UserPasswordInsertionForm = ({ deviceId }: { deviceId: string }) => {
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
        console.error('Invalid user response:', JSON.stringify(validated.error));
        return;
      }
      toast.success('Password updated successfully');
      reset(); // Reset the form fields
      setDoLogout(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error updating password:', err);
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
          {/* new password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <MotionInput type='password' placeholder='password' {...field} />
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
                  <MotionInput type='password' placeholder='Confirm password' {...field} />
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
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default UserPasswordInsertionForm;
