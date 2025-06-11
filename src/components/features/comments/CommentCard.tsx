import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';
import { AuthResponse as User } from '@/schema/schema_auth';
import { deleteComment } from '@/services/service_comments';
import { CommentResponse } from '@/schema/schema_comment';
import AuthorDateBar from '@/components/features/post/AuthorDateBar';
import CommentForm from '@/components/features/comments/CommentForm';
import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import MotionButton from '@/components/motion_components/MotionButton';

/**
 * @summary A component to display a comment, with edit and delete functionality.
 * @param user - The user object to get the user information
 * @param comment - The comment object to get the comment information
 * @param setComments - The hook to set the comments state
 * @returns
 */
const CommentCard = ({
  user,
  comment,
  setComments,
}: {
  user: Partial<User> | null;
  comment: CommentResponse;
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // need to update the edit mode when the comment is updated
  const originalContentRef = useRef(comment.content);

  // A closure to handle the delete comment
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Send the request.
      const res = await deleteComment(comment.id);
      // Validate the response
      if (res.status !== 204) throw new Error('Error deleting comment');
      // Update the DOM
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Oops! Something went wrong, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // The hook is to work with `ref` to avoid the infinite loop
  useEffect(() => {
    if (editMode && comment.content !== originalContentRef.current) {
      setEditMode(false);
    }
  }, [comment.content, editMode]);

  // Load the comment form when in edit mode
  if (editMode) return <CommentForm user={user} comment={comment} setComments={setComments} />;

  return (
    <article className='border-border flex w-full flex-col gap-2 border-b px-2 py-2 transition-shadow'>
      <header className='w-full'>
        <AuthorDateBar
          authorName={comment.authorName}
          authorAvatar={comment.authorAvatar}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
        />
      </header>
      <p className='text-primary'>{comment.content}</p>
      {/* The possible operation panel */}
      <footer className='flex items-center justify-end gap-0'>
        {user?.id === comment.authorId && (
          <MotionButton
            buttonType='button'
            variant='ghost'
            size='sm'
            icon={<Pencil />}
            type='button'
            supportingText='Edit comment'
            disabled={loading}
            onClick={() => setEditMode(true)}
            isLoading={loading}
          />
        )}
        {(user?.id === comment.authorId || user?.isAdmin) && (
          <MotionDeleteButton
            deleteItem='the comment'
            supportingText='Delete comment'
            textOrIcon='icon'
            deleteHandler={handleDelete}
            size='sm'
            isLoading={loading}
            variant='ghost'
          />
        )}
      </footer>
    </article>
  );
};

export default CommentCard;
