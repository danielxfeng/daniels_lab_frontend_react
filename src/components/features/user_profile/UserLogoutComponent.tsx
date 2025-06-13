import { useState } from 'react';
import { toast } from 'sonner';
import { DeviceIdBodySchema } from '@/schema/schema_auth';
import { logoutUser } from '@/services/service_auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AtomicLogout from '@/components/shared/AtomicLogout';
import MotionButton from '@/components/motion_components/MotionButton';

/**
 * @summary UserLogoutComponent
 * @description
 * This component provides a button to log out the user.
 * It allows the user to log out from the current device or all devices,
 * which is provided by the backend.
 * When successful, it clear the local tokens, then redirects the user to the home page.
 * If the logout fails, it shows an error message, and still clears the local tokens,
 * and performs the redirect.
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
      console.error('Invalid deviceId:', JSON.stringify(validatedBody.error));
      body.deviceId = undefined;
    }

    try {
      await logoutUser(body);
      return toast.success('Logout successful');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error logging out:', error.response?.statusText);
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
