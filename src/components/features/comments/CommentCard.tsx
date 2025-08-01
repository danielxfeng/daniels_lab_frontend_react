import { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import CommentForm from '@/components/features/comments/CommentForm';
import AuthorDateBar from '@/components/features/post/AuthorDateBar';
import MotionButton from '@/components/motion_components/MotionButton';
import MotionDeleteButton from '@/components/motion_components/MotionDeleteButton';
import logError from '@/lib/logError';
import { AuthResponse as User } from '@/schema/schema_auth';
import { CommentResponse } from '@/schema/schema_comment';
import { deleteComment } from '@/services/service_comments';

type CommentCardProps = {
  user: Partial<User> | null;
  comment: CommentResponse;
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
};

const CommentCard = ({ user, comment, setComments }: CommentCardProps) => {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // need to update the edit mode when the comment is updated
  const originalContentRef = useRef(comment.content);

  // A closure to handle the delete comment
  const handleDelete = async () => {
    setLoading(true);
    try {
      // Send the request.
      await deleteComment(comment.id);
      // Update the DOM
      setComments((prev) => prev.filter((c) => c.id !== comment.id));
    } catch (error) {
      logError(error, 'Error deleting comment');
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
    <article
      className='border-border flex w-full flex-col gap-2 border-b px-2 py-2'
      data-role='comment-card'
    >
      <header className='w-full' data-role='comment-card-header'>
        <AuthorDateBar
          authorName={comment.authorName}
          authorAvatar={comment.authorAvatar}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
        />
      </header>
      <p className='text-primary' data-role='comment-card-comment'>
        {comment.content}
      </p>
      {/* The possible operation panel */}
      <footer className='flex items-center justify-end gap-2' data-role='comment-card-footer'>
        {user?.id === comment.authorId && (
          <MotionButton
            buttonType='button'
            variant='ghost'
            size='sm'
            icon={<Pencil />}
            type='button'
            supportingText='Edit comment'
            isDisabled={loading}
            onClick={() => setEditMode(true)}
            isLoading={loading}
            dataRole='button-edit-comment'
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
            dataRole='button-delete-comment'
          />
        )}
      </footer>
    </article>
  );
};

export default CommentCard;
