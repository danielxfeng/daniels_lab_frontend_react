import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { deletePost } from '@/services/services_posts';
import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';

/// A component to delete a post
const PostDeleteComponent = ({ postId }: { postId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      await deletePost(postId);

      toast('Post deleted successfully!');
      setTimeout(() => {
        navigate(`/blog/posts`);
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to delete post');
      return console.error('Failed to delete post:', JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MotionDeleteButton
      toDelete='the post and related comments'
      tooltip='Delete post'
      deleteHandler={deleteHandler}
      size='h-6 w-6'
      isLoading={isLoading}
    />
  );
};

export default PostDeleteComponent;
