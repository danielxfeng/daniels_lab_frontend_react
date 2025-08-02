'use client';

import { LoaderFunctionArgs } from 'react-router';

import UserManagementTable from '@/components/features/user_profile/UserManagementTable';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';
import { adminGuard } from '@/lib/authGuard';

const clientLoader = async ({ request }: LoaderFunctionArgs) => {
  return adminGuard({ request });
};

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

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };
