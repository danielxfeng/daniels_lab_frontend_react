import MotionH1 from '@/components/motion_components/MotionH1';
import PostUpsertForm from '@/components/features/post/PostUpsertForm';
import siteMeta from '@/constants/siteMeta';

/// A component to create a new post
const PostCreatePage = () => {
  return (
    <div className='inner-container'>
      <title>{`Create a new post – ${siteMeta.siteName}`}</title>
      <MotionH1>New Post</MotionH1>
      <PostUpsertForm post={null} />
    </div>
  );
};

export default PostCreatePage;
