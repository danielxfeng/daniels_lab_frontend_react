import MotionH1 from '@/components/motion_components/MotionH1';
import PostUpsertForm from '@/components/features/post/PostUpsertForm';

/// A component to create a new post
const PostCreatePage = () => {
  return (
    <div className='inner-container'>
      <MotionH1>New Post</MotionH1>
      <PostUpsertForm post={null} />
    </div>
  );
};

export default PostCreatePage;
