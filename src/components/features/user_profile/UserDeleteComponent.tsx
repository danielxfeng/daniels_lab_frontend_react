import { useState } from 'react';
import { toast } from 'sonner';

import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import AtomicLogout from '@/components/shared/AtomicLogout';
import { UserResponse } from '@/schema/schema_users';
import { deleteUser } from '@/services/service_auth';

/**
 * @summary UserDeleteComponent
 * @description
 * This component allows users to delete their account.
 * It shows a confirmation dialog and performs the deletion.
 * After deletion, it calls AtomicLogout to clear the tokens and navigate the user to the home page.
 * @param {user} - The user object containing the user's information.
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
      console.error('Error deleting user:', error);
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
      />
    </>
  );
};

export default UserDeleteComponent;
