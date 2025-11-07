import { useForm } from 'react-hook-form';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
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
import siteMeta from '@/constants/siteMeta';
import logError from '@/lib/logError';
import { AuthResponseSchema, LoginBody, LoginBodySchema } from '@/schema/schema_auth';
import { OauthProviderValues } from '@/schema/schema_components';
import { loginUser } from '@/services/service_auth';
import useUserStore from '@/stores/useUserStore';

const iconMap = {
  google: <FaGoogle />,
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// A component for the OAuth login bar
const OauthLoginBar = ({ deviceId }: { deviceId: string }) => {
  let redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
  if (redirectTo === '/user/login') redirectTo = '/';

  return (
    <div className='flex w-full flex-col justify-center gap-8' data-role='oauth-login-bar'>
      {OauthProviderValues.map((provider) => (
        <MotionButton
          variant='highlight'
          size='md'
          supportingText={`Login with ${provider}`}
          text={'Login with ' + capitalizeFirstLetter(provider)}
          to={`${siteMeta.apiUrl}/auth/oauth/${provider}?deviceId=${deviceId}&consentAt=${new Date().toISOString()}&redirectTo=${encodeURIComponent(redirectTo)}`}
          key={provider}
          icon={iconMap[provider as keyof typeof iconMap]}
          isExternal={false}
          dataRole={`button-oauth-login-${provider}`}
        />
      ))}
    </div>
  );
};

// The main login form component
const LoginForm = ({ deviceId }: { deviceId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setUser } = useUserStore.getState();

  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
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
  const onSubmit = async (data: LoginBody) => {
    try {
      const res = await loginUser(data);

      // Check if the response is valid
      const validatedRes = AuthResponseSchema.safeParse(res.data);
      if (!validatedRes.success) {
        toast.error('Invalid response from server, please try again later');
        logError(validatedRes.error, 'Response error');
        return;
      }

      toast.success('Login successful');
      setAccessToken(validatedRes.data.accessToken);
      setUser(validatedRes.data);
      setTimeout(() => {
        reset();
        const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/';
        navigate(redirectTo, { replace: true });
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('username', {
          type: 'manual',
          message: 'Invalid username or password',
        });
        setError('password', {
          type: 'manual',
          message: 'Invalid username or password',
        });
        return;
      }
      toast.error('Login failed, please try again later');
      logError(error, 'Login error');
    } finally {
      setValue('password', '');
    }
  };

  return (
    <div className='mt-10 flex flex-1 flex-col'>
      <h3>Connect with:</h3>
      <OauthLoginBar deviceId={deviceId} />
      <hr className='text-muted-foreground my-9' />
      <h3>By your account:</h3>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4'
          aria-label='login-form'
          data-role='form-login'
        >
          <fieldset className='flex flex-col gap-4'>
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
                      autoComplete='current-password'
                      data-role='input-password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <MotionButton
              buttonType='submit'
              text='Login'
              supportingText='Login'
              isDisabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              isFullWidth={true}
              variant='highlight'
              size='md'
              dataRole='button-submit-login'
            />
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
