import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import MotionButton from '@/components/motion_components/MotionButton';
import logError from '@/lib/logError';
import { LikeStatusResponse, LikeStatusResponseSchema } from '@/schema/schema_like';
import { getLikeStatus, likePost, unlikePost } from '@/services/service_likes';

// Fallback value
const fallback: LikeStatusResponse = {
  count: 0,
  liked: false,
};

/**
 * @summary A component that displays the like status of a post.
 */
const Likes = ({ postId, userId }: { postId: string; userId: string | undefined }) => {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // LikeStatus fetcher
  const fetchLikeStatus = async (postId: string): Promise<LikeStatusResponse> => {
    // Fetch like status
    try {
      const response = await getLikeStatus(postId);
      const validatedLikeStatus = LikeStatusResponseSchema.safeParse(response.data);
      if (!validatedLikeStatus.success) {
        logError(validatedLikeStatus.error, 'Invalid like status response');
        return fallback;
      }
      return validatedLikeStatus.data;
    } catch (error) {
      logError(error, 'Error fetching like status');
      return fallback;
    }
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    // toast user to log in
    if (!userId) return toast.warning('Please log in to like this post');

    // Send like/unlike request
    setLoading(true);
    try {
      const res = liked ? await unlikePost(postId) : await likePost(postId);

      // 204: successful like/unlike
      if (res.status == 204) {
        setCount((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((prev) => !prev);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 401) return toast.warning('Please log in to like this post');
      if (error?.response?.status === 404) return; // 404: post not found or duplicate like
      toast.error('Error toggling like. Please try again later.');
      logError(error, 'Error toggling like');
    } finally {
      setLoading(false);
    }
  };

  // A hook to fetch the status on mount
  useEffect(() => {
    // useEffect cannot be async, so define and call an inner async function.
    const loadLikeStatus = async () => {
      const likeStatus = await fetchLikeStatus(postId);
      setCount(likeStatus.count);
      setLiked(likeStatus.liked);
    };

    // The hook logic
    loadLikeStatus();
  }, [postId]);

  return (
    <div className='flex items-center gap-2'>
      {/* Toggle button */}
      <MotionButton
        buttonType='button'
        supportingText={liked ? 'Unlike the post' : 'Like the post'}
        variant='ghost'
        size='sm'
        icon={<Heart />}
        type='button'
        onClick={handleLikeToggle}
        iconClass={liked ? 'text-red-500' : undefined}
        isDisabled={loading}
        isLoading={loading}
        dataRole='button-like-toggle'
      />
      {/* Like count */}
      <span className='text-muted-foreground text-sm' data-role='like-count'>
        {count}
      </span>
    </div>
  );
};

export default Likes;
