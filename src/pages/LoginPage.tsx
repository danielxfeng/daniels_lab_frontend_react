import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MotionH1 from '@/components/motion_components/MotionH1';
import LoginForm from '@/components/features/login/LoginForm';
import RegisterForm from '@/components/features/login/RegisterForm';
import siteMeta from '@/constants/siteMeta';

// A component for the GDPR notice
const GDPR = () => (
  <div className={'text-muted-foreground mt-8 w-full text-center text-sm'}>
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
const LoginPage = () => (
  <div className='inner-container'>
    <title>{`Login – ${siteMeta.siteName}`}</title>
    <MotionH1>Login</MotionH1>
    <Tabs defaultValue='login' className='mx-auto mt-8 flex max-w-2xl'>
      <TabsList className='w-full'>
        <TabsTrigger value='login'>Login</TabsTrigger>
        <TabsTrigger value='register'>Register</TabsTrigger>
      </TabsList>
      <TabsContent value='login'>
        {' '}
        <LoginForm />
      </TabsContent>
      <TabsContent value='register'>
        <RegisterForm />
      </TabsContent>
    </Tabs>
    <GDPR />
  </div>
);

export default LoginPage;
