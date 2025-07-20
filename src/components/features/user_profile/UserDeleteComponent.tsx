import { useState } from 'react';
import { toast } from 'sonner';

import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import AtomicLogout from '@/components/shared/AtomicLogout';
import logError from '@/lib/logError';
import { UserResponse } from '@/schema/schema_users';
import { deleteUser } from '@/services/service_auth';

/**
 * @summary UserDeleteComponent
 */
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
      logError(error, 'Error deleting user');
      toast.error('Error deleting user');
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Ensure atomic logout */}
      {doLogout && <AtomicLogout to='/' timeout={1000} />}
      <MotionDeleteButton
        deleteItem='my account'
        supportingText='Delete my account'
        textOrIcon='text'
        deleteHandler={deleteHandler}
        size='sm'
        isLoading={loading}
        dataRole='button-delete-user'
      />
    </>
  );
};

export default UserDeleteComponent;
