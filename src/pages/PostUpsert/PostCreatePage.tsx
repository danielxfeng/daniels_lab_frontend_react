import PostUpsertForm from '@/components/features/post/PostUpsertForm';
import MotionH1 from '@/components/motion_components/MotionH1';
import NotificationBar from '@/components/shared/NotificationBar';
import siteMeta from '@/constants/siteMeta';

/// A component to create a new post
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
