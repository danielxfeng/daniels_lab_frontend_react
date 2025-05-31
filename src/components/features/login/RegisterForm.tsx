import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
import { AuthResponseSchema, RegisterBody, RegisterBodySchema } from '@/schema/schema_auth';

import useUserStore from '@/stores/useUserStore';
import { registerUser } from '@/services/service_auth';

/// This component is used to register a new user
const RegisterForm = ({deviceId} : {deviceId : string}) => {
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
      avatarUrl: '',
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
          avatarUrl: '',
          consentAt: new Date().toISOString(),
          deviceId,
        });
        const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
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
    <div className='mt-8 flex flex-1 flex-col gap-4'>
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
                    <Input {...field} className='bg-muted border-muted-foreground' />
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
                    <Input
                      type='password'
                      {...field}
                      className='bg-muted border-muted-foreground'
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
                    <Input
                      type='password'
                      {...field}
                      className='bg-muted border-muted-foreground'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar URL */}
            <FormField
              control={form.control}
              name='avatarUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Avatar URL <span className='text-muted-foreground italic'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='url'
                      {...field}
                      className='bg-muted border-muted-foreground'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MotionTextButton
              type='submit'
              label='Register'
              ariaLabel='Register'
              disabled={!isValid || isSubmitting}
              className='w-full'
              isLoading={isSubmitting}
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
