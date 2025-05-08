import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import getDeviceId from '@/lib/deviceid';
import {
  AuthResponseSchema,
  ChangePasswordBody,
  ChangePasswordBodySchema,
} from '@/schema/schema_auth';
import { changePassword } from '@/services/service_auth';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import AtomicLogout from '../AtomicLogout';

// A component to update the user password
const UserPasswordUpdateForm = () => {
  const [doLogout, setDoLogout] = useState<boolean>(false);
  const [errorCurrentPassword, setCurrentPassword] = useState<string>('');

  // Init the form
  const form = useForm<ChangePasswordBody>({
    resolver: zodResolver(ChangePasswordBodySchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { isSubmitting, isValid },
  } = form;

  const currentPasswordValue = watch('currentPassword');

  useEffect(() => {
    if (errorCurrentPassword !== '' && currentPasswordValue !== '') {
      setCurrentPassword('');
      clearErrors('currentPassword');
    }
  }, [clearErrors, currentPasswordValue, errorCurrentPassword, setError]);

  // Add the deviceId to the form
  useEffect(() => {
    getDeviceId().then((deviceId) => {
      setValue('deviceId', deviceId);
    });
  }, [setValue]);

  const onSubmit = async (data: ChangePasswordBody) => {
    try {
      const res = await changePassword(data);
      const validated = AuthResponseSchema.safeParse(res.data);
      if (!validated.success) {
        console.error('Invalid user response:', JSON.stringify(validated.error));
        return;
      }
      toast.success('Password updated successfully');
      setDoLogout(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        setCurrentPassword(data.currentPassword);
        setError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
      } else {
        console.error('Error changing password:', err.response?.statusText);
        toast.error('Error changing password, please try again later');
      }
    } finally {
      reset({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
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
                  <Input type='password' placeholder='Current password' {...field} />
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
                  <Input type='password' placeholder='New password' {...field} />
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
                  <Input type='password' placeholder='Confirm new password' {...field} />
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
