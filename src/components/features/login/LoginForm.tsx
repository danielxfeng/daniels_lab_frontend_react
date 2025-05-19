import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import { AuthResponseSchema, LoginBody, LoginBodySchema } from '@/schema/schema_auth';
import { toast } from 'sonner';
import useUserStore from '@/stores/useUserStore';
import getDeviceId from '@/lib/deviceid';
import { loginUser } from '@/services/service_auth';
import { OauthProviderValues } from '@/schema/schema_components';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import siteMeta from '@/constants/siteMeta';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';

const iconMap = {
  google: <FaGoogle className='h-12 w-12' />,
  github: <FaGithub className='h-12 w-12' />,
  linkedin: <FaLinkedin className='h-12 w-12' />,
};

// A component for the OAuth login bar
const OauthLoginBar = () => {
  return (
    <div className='flex w-full justify-center gap-8'>
      {OauthProviderValues.map((provider) => (
        <MotionIconLink
          to={`${siteMeta.apiUrl}/auth/oauth/${provider}`}
          key={provider}
          ariaLabel={`Login with ${provider}`}
          icon={iconMap[provider as keyof typeof iconMap]}
          isExternal={false}
          tooltip={`Login with ${provider}`}
        />
      ))}
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const { setAccessToken, setUser } = useUserStore.getState();

  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      deviceId: '',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, isValid },
  } = form;

  // Invalidation username or password returned by the server
  const username = watch('username');
  const password = watch('password');

  // Set deviceId once
  useEffect(() => {
    getDeviceId().then((id) => {
      setValue('deviceId', id);
    });
  }, [setValue]);

  // Handle manual username error
  useEffect(() => {
    if (!formError || password === '') return;
    const timeout = setTimeout(() => setFormError(null), 300);
    return () => clearTimeout(timeout);
  }, [username, password, formError]);

  // Submit handler
  const onSubmit = async (data: LoginBody) => {
    setFormError(null); // Clear the manual error
    try {
      const res = await loginUser(data);

      // Check if the response is valid
      const validatedRes = AuthResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        setFormError('Something went wrong, please try again later');
        console.error('Response error', validatedRes.error);
        return;
      }

      setAccessToken(validatedRes.data.accessToken);
      setUser(validatedRes.data);
      toast.success('Login successful');
      setTimeout(() => {
        reset();
        const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
        navigate(redirectTo, { replace: true });
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401) return setFormError('Invalid username or password');
      setFormError('Something went wrong, please try again later');
      console.error('Login error:', error);
    } finally {
      setValue('password', '');
    }
  };

  return (
    <div className='mt-8 flex flex-1 flex-col gap-12'>
      <OauthLoginBar />
      <hr className='text-muted-foreground' />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <fieldset className='flex flex-col gap-4'>
            {/* Username */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className='bg-muted border-muted-foreground'/>
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
                    <Input type='password' {...field} className='bg-muted border-muted-foreground' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <MotionTextButton
              type='submit'
              label='Login'
              ariaLabel='Login'
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              className='w-full'
            />
            {formError && <div className='text-destructive'>{formError}</div>}
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
