import { useState } from 'react';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import AtomicLogout from '@/components/shared/AtomicLogout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logError from '@/lib/logError';
import { DeviceIdBodySchema } from '@/schema/schema_auth';
import { logoutUser } from '@/services/service_auth';

/**
 * @summary UserLogoutComponent
 */
const UserLogoutComponent = ({ deviceId }: { deviceId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Ensure atomic logout
  const [doLogout, setDoLogout] = useState<boolean>(false);

  // A function to handle the logout
  const logoutHandler = async (isAll: boolean) => {
    setLoading(true);
    // We use deviceId to identify the device
    const body = isAll ? { deviceId: undefined } : { deviceId };
    const validatedBody = DeviceIdBodySchema.safeParse(body);
    // Validate the req, fallback to logout all devices
    if (!validatedBody.success) {
      logError(validatedBody.error, 'Invalid deviceId');
      body.deviceId = undefined;
    }

    try {
      await logoutUser(body);
      return toast.success('Logout successful');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logError(error, 'Error logging out');
      return toast.error('Error, failed to revoke tokens on server, only local tokens are deleted');
    } finally {
      setLoading(false);
      setDoLogout(true);
    }
  };

  return (
    <div className='flex w-full items-center'>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      {/* Logout button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MotionButton
            buttonType='button'
            size='md'
            supportingText='Logout'
            variant='ghost'
            text='Logout'
            isLoading={loading}
            isDisabled={loading}
            isFullWidth={true}
            dataRole='button-logout'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='border-border text-muted-foreground'>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logoutHandler(false)}>
            Logout current device
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logoutHandler(true)}>
            Logout all devices
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserLogoutComponent;
