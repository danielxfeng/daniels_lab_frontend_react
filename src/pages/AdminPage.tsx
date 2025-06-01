import UserManagementTable from '@/components/features/user_profile/UserManagementTable';
import MotionH1 from '@/components/motion_components/MotionH1';
import siteMeta from '@/constants/siteMeta';

const AdminPage = () => (
  <div className='inner-container'>
    <title>{`User Management – ${siteMeta.siteName}`}</title>
    <MotionH1>User Management</MotionH1>
    <div className='w-full overflow-x-auto mt-8'>
    <UserManagementTable />
    </div>
  </div>
);

export default AdminPage;
