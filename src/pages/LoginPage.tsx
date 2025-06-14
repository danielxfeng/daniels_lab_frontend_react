import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import LoginForm from '@/components/features/login/LoginForm';
import RegisterForm from '@/components/features/login/RegisterForm';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import siteMeta from '@/constants/siteMeta';
import getDeviceId from '@/lib/deviceid';

// A component for the GDPR notice
const GDPR = () => (
  <div className={'text-muted-foreground mt-8 w-full text-center text-sm'} data-role='gdpr-notice'>
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

/**
 * LoginPage component, with login and register forms.
 */
const LoginPage = () => {
  const location = useLocation();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const errMsg = location.state?.error;

  // Show error message from the location state
  // use useEffect to display only when the error message changes
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg, { duration: 5000 });
    }
  }, [errMsg]);

  useEffect(() => {
    getDeviceId().then((id) => {
      setDeviceId(id);
    });
  }, []);

  if (!deviceId) return null;

  return (
    <div className='inner-container' data-role='login-page'>
      <title>{`Login – ${siteMeta.siteName}`}</title>
      <NotificationBar />
      <MotionH1>Login</MotionH1>
      <Tabs defaultValue='login' className='mx-auto mt-8 flex max-w-2xl'>
        <TabsList className='w-full'>
          <TabsTrigger value='login'>Login</TabsTrigger>
          <TabsTrigger value='register'>Register</TabsTrigger>
        </TabsList>
        <TabsContent value='login' className='mx-auto w-full lg:max-w-lg'>
          {' '}
          <LoginForm deviceId={deviceId} />
        </TabsContent>
        <TabsContent value='register' className='mx-auto w-full lg:max-w-lg'>
          <RegisterForm deviceId={deviceId} />
        </TabsContent>
      </Tabs>
      <GDPR />
    </div>
  );
};

export default LoginPage;
