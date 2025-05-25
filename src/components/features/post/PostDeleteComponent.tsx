import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePost } from '@/services/services_posts';
import MotionIconButton from '@/components/motion_components/MotionIconButton';

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <MotionIconButton
          icon={<Trash2 className='h-6 w-6' />}
          ariaLabel='Delete post'
          type='button'
          disabled={isLoading}
          isLoading={isLoading}
          className='text-destructive'
          tooltip='Delete post'
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post and all related
            comments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='text-muted-foreground' disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deleteHandler}
            disabled={isLoading}
            className='bg-destructive hover:bg-destructive'
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PostDeleteComponent;
