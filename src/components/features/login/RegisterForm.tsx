import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { AuthResponseSchema, RegisterBody, RegisterBodySchema } from '@/schema/schema_auth';
import { registerUser } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';

/// This component is used to register a new user
const RegisterForm = ({ deviceId }: { deviceId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Snapshot, not the subscription
  const { setAccessToken, setUser } = useUserStore.getState();

  const form = useForm<RegisterBody>({
    resolver: zodResolver(RegisterBodySchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      consentAt: new Date().toISOString(),
      deviceId,
    },
  });

  const {
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  // Submit handler
  const onSubmit = async (data: RegisterBody) => {
    try {
      const res = await registerUser(data);

      // Validate response
      const validatedRes = AuthResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        toast.error('Something went wrong, please try again later');
        return console.error(`Response error: ${JSON.stringify(validatedRes.error)}`);
      }

      // Success
      setAccessToken(validatedRes.data.accessToken);
      setUser(validatedRes.data);
      toast.success('Register successful');

      setTimeout(() => {
        reset({
          username: '',
          password: '',
          confirmPassword: '',
          consentAt: new Date().toISOString(),
          deviceId,
        });
        let redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
        if (redirectTo === '/user/login') redirectTo = '/';
        navigate(redirectTo, { replace: true });
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
      toast.error('Something went wrong, please try again later');
      console.error('Register error:', error.status);
    } finally {
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  };

  return (
    <div
      className='mt-8 flex flex-1 flex-col gap-4'
      data-role='register-form'
      aria-label='Register form'
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <fieldset className='flex flex-col gap-4' disabled={isSubmitting}>
            {/* Username */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <MotionInput {...field} autoComplete='username' data-role='input-username' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <MotionInput
                      type='password'
                      {...field}
                      autoComplete='new-password'
                      data-role='input-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <MotionInput
                      type='password'
                      {...field}
                      autoComplete='new-password'
                      data-role='input-confirm-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MotionButton
              buttonType='submit'
              text='Register'
              supportingText='Register'
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              isFullWidth={true}
              variant='highlight'
              size='md'
              dataRole='button-submit-register'
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
