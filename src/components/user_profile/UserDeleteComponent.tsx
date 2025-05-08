import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserResponse } from '@/schema/schema_users';
import { deleteUser } from '@/services/service_auth';
import MotionTextButton from '@/components/motion_components/MotionTextButton';
import AtomicLogout from '@/components/AtomicLogout';

const UserDeleteComponent = ({ user }: { user: Partial<UserResponse> }) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Ensure atomic logout
  const [doLogout, setDoLogout] = useState<boolean>(false);

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id!);
      toast.success('Account deleted successfully');
      setDoLogout(true);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
      return;
    } finally {
      setLoading(false);
    }
  };
  console.log('Render: UserDeleteComponent');

  return (
    <AlertDialog>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      <AlertDialogTrigger asChild>
        <MotionTextButton
          label='Delete Account'
          ariaLabel='Delete Account'
          type='button'
          className='bg-destructive'
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and all related
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteHandler}
            disabled={loading}
            className='bg-destructive hover:bg-destructive'
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteComponent;
