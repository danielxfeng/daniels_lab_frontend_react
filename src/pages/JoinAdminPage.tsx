'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import MotionH1 from '@/components/motion_components/MotionH1';
import MotionInput from '@/components/motion_components/MotionInput';
import AtomicLogout from '@/components/shared/AtomicLogout';
import NotificationBar from '@/components/shared/NotificationBar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import siteMeta from '@/constants/siteMeta';
import { authGuard } from '@/lib/authGuard';
import getDeviceId from '@/lib/deviceid';
import logError from '@/lib/logError';
import { AuthResponseSchema, JoinAdminBody, JoinAdminBodySchema } from '@/schema/schema_auth';
import { joinAdmin } from '@/services/service_auth';

const clientLoader = async ({ request }: { request: Request }) => {
  return authGuard({ request });
};

// A form to join admin with a reference code
const JoinAdminForm = ({ deviceId }: { deviceId: string }) => {
  const [doLogout, setDoLogout] = useState<boolean>(false);

  const form = useForm<JoinAdminBody>({
    resolver: zodResolver(JoinAdminBodySchema),
    mode: 'onTouched',
    defaultValues: {
      referenceCode: '',
      deviceId,
    },
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid },
  } = form;

  const onSubmit = async (data: JoinAdminBody) => {
    try {
      const res = await joinAdmin(data);
      const validated = AuthResponseSchema.safeParse(res.data);
      if (!validated.success) {
        logError(validated.error, 'Invalid response');
        toast.error('Invalid response from server, please try later');
        return;
      }
      reset(); // Reset the form fields
      toast.success('Successfully joined as admin!');
      setDoLogout(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError('referenceCode', {
          type: 'manual',
          message: 'Invalid reference code. Please try again.',
        });
        return;
      }
      logError(err, 'Error joining admin');
      toast.error('Failed to join as admin. Please try again later.');
    }
  };

  return (
    <Form {...form}>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full max-w-96 flex-col gap-4'
        data-role='join-admin-form'
        aria-label='Join Admin Form'
      >
        <fieldset disabled={isSubmitting} className='flex flex-col gap-6'>
          {/* Reference Code Input */}
          <FormField
            control={form.control}
            name='referenceCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference Code</FormLabel>
                <FormControl>
                  <MotionInput
                    {...field}
                    placeholder='Enter your reference code'
                    data-role='input-reference-code'
                    autoComplete='off'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit button */}
          <MotionButton
            buttonType='submit'
            variant='highlight'
            size='md'
            isFullWidth={true}
            text='Submit'
            supportingText='Submit'
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            dataRole='button-submit-join-admin'
          />
        </fieldset>
      </form>
    </Form>
  );
};

const JoinAdminPage = () => {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    getDeviceId().then((id) => {
      setDeviceId(id);
    });
  }, []);

  if (!deviceId) return null;
  return (
    <div className='inner-container w-full' data-role='join-admin-page'>
      <title>{`User Profile – ${siteMeta.siteName}`}</title>
      <NotificationBar />
      <MotionH1>Join Admin</MotionH1>
      <div className='flex w-full items-center justify-center'>
        <JoinAdminForm deviceId={deviceId} />
      </div>
    </div>
  );
};

export default JoinAdminPage;

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };
