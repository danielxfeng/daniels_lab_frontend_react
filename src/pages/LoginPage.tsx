import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  AuthResponseSchema,
  LoginBody,
  LoginBodySchema,
  RegisterBody,
  RegisterBodySchema,
} from '@/schema/schema_auth';
import { loginUser, registerUser } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';
import { zodResolver } from '@hookform/resolvers/zod';
import getDeviceId from '@/lib/deviceid';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import { OauthProviderValues } from '@/schema/schema_components';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import MotionIconLink from '@/components/motion_components/MotionIconLink';
import siteMeta from '@/constants/siteMeta';
import { cn } from '@/lib/utils';

// The styles for the input fields
const inputStyles =
  'w-full border p-2 rounded-xl px-4 bg-muted focus:outline-none  mt-2 border-muted-foreground focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out';

const iconMap = {
  google: <FaGoogle className='h-12 w-12' />,
  github: <FaGithub className='h-12 w-12' />,
  linkedin: <FaLinkedin className='h-12 w-12' />,
};

// A component for the GDPR notice
const GDPR = ({ isDesktop }: { isDesktop: boolean }) => (
  <div
    className={cn(
      'text-muted-foreground mt-8 w-full text-center text-sm',
      isDesktop ? 'hidden md:block' : 'md:hidden',
    )}
  >
    By continuing, you agree to our{' '}
    <a
      href='/terms'
      className='hover:text-primary underline underline-offset-4 transition-colors'
      target='_blank'
      rel='noopener noreferrer'
    >
      Terms of Service
    </a>{' '}
    and acknowledge that your data is processed in accordance with our GDPR policy.
  </div>
);

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

// A component for a login form.
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const { setAccessToken, setUser } = useUserStore.getState();

  // Init the form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      deviceId: '',
    },
  });

  // Set the deviceId value when the component mounts
  useEffect(() => {
    getDeviceId().then((id) => {
      setValue('deviceId', id);
    });
  }, [setValue]);

  // Watch the username and password fields
  const username = watch('username');
  const password = watch('password');

  // Clear the 401 error when the username or password changes
  useEffect(() => {
    if (!formError || password === '') return;

    const timeout = setTimeout(() => {
      setFormError(null);
    }, 300);

    return () => clearTimeout(timeout);
  }, [username, password, formError]);

  // The onSubmit handler
  const onSubmit = async (data: LoginBody) => {
    setFormError(null);

    try {
      const res = await loginUser(data);

      const validatedRes = AuthResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        setFormError('Something went wrong, please try again later');
        console.error(`Response error`, validatedRes.error);
        return;
      }

      // Handle the login success
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
    <div className='flex flex-1 flex-col gap-12'>
      <h2>Login to the website</h2>
      <OauthLoginBar />
      <hr className='text-muted-foreground' />
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <fieldset className='flex flex-col gap-4'>
          <div>
            <label htmlFor='username'>Username</label>
            <input id='login_username' {...register('username')} className={inputStyles} />
            {errors.username && (
              <p className='text-destructive w-full'>{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='login_password'
              {...register('password')}
              className={inputStyles}
            />
            {errors.password && (
              <p className='text-destructive w-full'>{errors.password.message}</p>
            )}
          </div>
          <MotionTextButton
            type='submit'
            label='Login'
            ariaLabel='Login'
            disabled={!isValid || isSubmitting}
            className='w-full'
            isLoading={isSubmitting}
          />
          {formError && <div className='text-destructive'>{formError}</div>}
        </fieldset>
      </form>
    </div>
  );
};

// A component for a register form.
const RegisterForm = () => {
  const [manualUsername, setManualUsername] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setUser } = useUserStore.getState();

  // Init the form
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterBody>({
    resolver: zodResolver(RegisterBodySchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      avatarUrl: '',
      consentAt: new Date().toISOString(),
      deviceId: '',
    },
  });

  // Set the deviceId value when the component mounts
  useEffect(() => {
    getDeviceId().then((id) => {
      setValue('deviceId', id);
    });
  }, [setValue]);

  // Set the error message for the username field
  const handleUsernameExistsError = () => {
    setManualUsername(username);
    setError('username', {
      type: 'manual',
      message: 'Username already exists',
    });
  };

  // Clear the error message after 300ms
  const username = watch('username');

  useEffect(() => {
    if (errors.username?.type !== 'manual' || manualUsername === username) return;

    const timeout = setTimeout(() => {
      clearErrors('username');
    }, 300);
    return () => clearTimeout(timeout);
  }, [username, errors.username?.type, manualUsername, clearErrors]);

  // The onSubmit handler
  const onSubmit = async (data: RegisterBody) => {
    try {
      // Call the login function
      const res = await registerUser(data);
      const validatedRes = AuthResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        toast('Something went wrong, please try again later');
        return console.error(`Response error, ${JSON.stringify(validatedRes.error)}`);
      }

      // Handle the login success
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
          deviceId: '',
        });
        const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
        navigate(redirectTo, { replace: true });
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle the username already exists error
      if (error.response?.status === 409) return handleUsernameExistsError();

      // Other errors
      toast('Something went wrong, please try again later');
      return console.error(`Register error, ${error.status}`);
    } finally {
      // Clear the password field
      setValue('password', '');
      setValue('confirmPassword', '');
    }
  };

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h2>Or register a new user</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <fieldset className='flex flex-col gap-4'>
          <div>
            <label htmlFor='username'>Username</label>
            <input id='username' {...register('username')} className={inputStyles} />
            {errors.username && (
              <p className='text-destructive w-full'>{errors.username.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              {...register('password')}
              className={inputStyles}
            />
            {errors.password && (
              <p className='text-destructive w-full'>{errors.password.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              id='confirmPassword'
              {...register('confirmPassword')}
              className={inputStyles}
            />
            {errors.confirmPassword && (
              <p className='text-destructive w-full'>{errors.confirmPassword.message as string}</p>
            )}
          </div>
          <div>
            <label htmlFor='avatarUrl'>
              Avatar URL <span className='text-muted-foreground italic'>(optional)</span>
            </label>
            <input
              type='url'
              id='avatarUrl'
              {...register('avatarUrl', {
                setValueAs: (v) => (v.trim() === '' ? undefined : v.trim()),
              })}
              className={inputStyles}
            />
            {errors.avatarUrl && (
              <p className='text-destructive w-full'>{errors.avatarUrl.message as string}</p>
            )}
          </div>
          <MotionTextButton
            type='submit'
            label='Register'
            ariaLabel='Register'
            disabled={!isValid || isSubmitting}
            className='w-full'
          />
        </fieldset>
      </form>
    </div>
  );
};

/**
 * LoginPage component, with login and register forms.
 */
const LoginPage = () => (
  <div className='inner-container'>
    <MotionH1>Login</MotionH1>
    <div className='flex w-full flex-col justify-center gap-4 md:flex-row'>
      <LoginForm />
      <GDPR isDesktop={false} />
      <div className='bg-muted hidden w-0.5 md:mx-20 md:flex'></div>
      <RegisterForm />
    </div>
    <GDPR isDesktop={true} />
  </div>
);

export default LoginPage;
