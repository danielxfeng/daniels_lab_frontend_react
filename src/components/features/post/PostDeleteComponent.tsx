import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import logError from '@/lib/logError';
import { deletePost } from '@/services/services_posts';

// A component to delete a post
const PostDeleteComponent = ({ postId }: { postId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const deleteHandler = async () => {
    try {
      setIsLoading(true);
      await deletePost(postId);

      toast.success('Post deleted successfully!');
      setTimeout(() => {
        navigate(`/blog/posts`);
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to delete post');
      logError(error, 'Failed to delete post');
      return;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <MotionDeleteButton
      deleteItem='the post and related comments'
      supportingText='Delete post'
      textOrIcon='text'
      deleteHandler={deleteHandler}
      size='md'
      isLoading={isLoading}
      dataRole='button-delete-post'
    />
  );
};

export default PostDeleteComponent;
