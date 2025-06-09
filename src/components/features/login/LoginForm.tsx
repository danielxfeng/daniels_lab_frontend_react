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
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import { AuthResponseSchema, LoginBody, LoginBodySchema } from '@/schema/schema_auth';
import { toast } from 'sonner';
import useUserStore from '@/stores/useUserStore';
import { loginUser } from '@/services/service_auth';
import { OauthProviderValues } from '@/schema/schema_components';
import siteMeta from '@/constants/siteMeta';
import { FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa6';
import MotionInput from '@/components/motion_components/MotionInput';
import MotionButton from '@/components/motion_components/MotionButton';

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
    <div className='flex w-full flex-col justify-center gap-8'>
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
        />
      ))}
    </div>
  );
};

const LoginForm = ({ deviceId }: { deviceId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, setUser } = useUserStore.getState();

  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),
    mode: 'onTouched',
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
      console.error('Login error:', error);
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
                    <MotionInput {...field} />
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
                    <MotionInput type='password' {...field} />
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
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
