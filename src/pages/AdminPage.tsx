import UserManagementTable from '@/components/features/user_profile/UserManagementTable';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

const AdminPage = () => (
  <div className='inner-container' data-role='admin-page'>
    <title>{`User Management – ${siteMeta.siteName}`}</title>
    <NotificationBar />
    <MotionH1>User Management</MotionH1>
    <div className='mt-8 w-full overflow-x-auto'>
      <UserManagementTable />
    </div>
  </div>
);

export default AdminPage;
