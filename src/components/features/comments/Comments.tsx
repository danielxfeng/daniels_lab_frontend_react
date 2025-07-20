import { useCallback, useEffect, useRef, useState } from 'react';

import CommentCard from '@/components/features/comments/CommentCard';
import CommentForm from '@/components/features/comments/CommentForm';
import MotionButton from '@/components/motion_components/MotionButton';
import Spinner from '@/components/shared/Spinner';
import siteMeta from '@/constants/siteMeta';
import insertToSet from '@/lib/insertToSet';
import {
  CommentResponse,
  CommentsListResponse,
  CommentsListResponseSchema,
} from '@/schema/schema_comment';
import { getComments } from '@/services/service_comments';
import useUserStore from '@/stores/useUserStore';

// Get of Crud comments
const getCommentsHelper = async (postId: string, offset: number): Promise<CommentsListResponse> => {
  // Set a fallback value
  const fallBack: CommentsListResponse = {
    comments: [],
    total: 0,
    offset: 0,
    limit: siteMeta.paginationLimit,
  };

  // Fetch the comments
  const res = await getComments(postId, offset, siteMeta.paginationLimit);

  // Validate the response
  if (res.status !== 200) {
    console.error('Error fetching comments:', res.statusText);
    return fallBack;
  }
  const validatedData = CommentsListResponseSchema.safeParse(res.data);
  if (!validatedData.success) {
    console.error('Error validating comments data:', validatedData.error);
    return fallBack;
  }

  // Return the validated data
  return validatedData.data;
};

/**
 * @summary A component to display the comments of a post.
 */
const Comments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref to store the comments to avoid the duplication.
  // The duplication happens when:
  // 1. The component is mounted in `strict mode`.
  // 2. A new comment is added, the offset can not be updated.
  // Set is used for reducing the time complexity from O(x * y) to O(x + y)
  const commentSetRef = useRef(new Set<string>());

  const user = useUserStore.getState().user;

  // A closure to handle the load more button
  // use useCallback to memoize the function for avoiding unnecessary re-renders
  const fetchComments = useCallback(
    async (offset: number) => {
      setIsLoading(true);
      try {
        const res = await getCommentsHelper(postId, offset);
        // Avoid duplication of comments
        const newComments = res.comments.filter((c) => insertToSet(c.id, commentSetRef.current));
        setComments((prev) => [...prev, ...newComments]);
        setTotal(res.total);
        setOffset(res.offset);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [postId],
  );

  // Load the comments on mounting
  useEffect(() => {
    const loadComments = async () => {
      await fetchComments(0);
    };

    loadComments();
  }, [fetchComments]);

  return (
    <aside
      className='mx-auto flex w-full max-w-2xl flex-col gap-2'
      data-role='comments'
      aria-label='Comments section'
    >
      <CommentForm user={user} comment={undefined} postId={postId} setComments={setComments} />
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} user={user} setComments={setComments} />
      ))}

      {total > siteMeta.paginationLimit + offset && (
        <MotionButton
          text='Load more'
          supportingText='Load more'
          buttonType={'button'}
          onClick={async () => await fetchComments(offset + siteMeta.paginationLimit)}
          disabled={isLoading}
          isLoading={isLoading}
          size='sm'
          variant='secondary'
          isFullWidth={true}
          btnClass='mt-3'
          dataRole='button-load-more-comments'
        />
      )}

      {/* Loading spinner */}
      {isLoading && <Spinner />}
    </aside>
  );
};

export default Comments;
