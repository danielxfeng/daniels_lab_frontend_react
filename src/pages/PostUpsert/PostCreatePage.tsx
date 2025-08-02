'use client';

import PostUpsertForm from '@/components/features/post/PostUpsertForm';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';
import { adminGuard } from '@/lib/authGuard';

const clientLoader = async ({ request }: { request: Request }) => {
  return adminGuard({ request });
};

const PostCreatePage = () => {
  return (
    <div className='inner-container' data-role='post-create-page'>
      <title>{`Create a new post – ${siteMeta.siteName}`}</title>
      <NotificationBar />
      <MotionH1>New Post</MotionH1>
      <PostUpsertForm post={null} />
    </div>
  );
};

export default PostCreatePage;

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader };
