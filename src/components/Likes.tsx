import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getLikeStatus, likePost, unlikePost } from '@/services/service_likes';
import { LikeStatusResponse, LikeStatusResponseSchema } from '@/schema/schema_like';
import MotionIconButton from './motion_components/MotionIconButton';
import { AxiosResponse } from 'axios';

/**
 * @summary A component that displays the like status of a post.
 * @param postId - The ID of the post to like/unlike.
 * @param userId - The ID of the user. If not provided, the like toggle will be disabled.
 * @returns A React component that displays the like status of a post.
 */
const Likes = ({ postId, userId }: { postId: string; userId: string | undefined }) => {
  const [count, setCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // LikeStatus fetcher
  const fetchLikeStatus = async (postId: string): Promise<LikeStatusResponse> => {
    // Fallback value
    const fallback: LikeStatusResponse = {
      count: 0,
      liked: false,
    };
    // Fetch like status
    const response = await getLikeStatus(postId);

    // Validate response
    if (response.status !== 200) {
      console.error('Error fetching like status:', response.statusText);
      return fallback;
    }
    const validatedLikeStatus = LikeStatusResponseSchema.safeParse(response.data);
    if (!validatedLikeStatus.success) {
      console.error('Invalid like status response:', JSON.stringify(validatedLikeStatus.error));
      return fallback;
    }

    // Return validated like status
    return validatedLikeStatus.data;
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    // toast user to log in
    if (!userId) return toast.warning('Please log in to like this post');

    let res: AxiosResponse<unknown>;

    // Send like/unlike request
    setLoading(true);
    if (liked) res = await unlikePost(postId);
    else res = await likePost(postId);

    // To prevent flickering
    setLoading(false);
    // 204: successful like/unlike
    if (res.status == 204) {
      setCount((prev) => (liked ? prev - 1 : prev + 1));
      setLiked((prev) => !prev);
      return;
    }

    // 404: post not found or duplicate like
    if (res.status == 404) return;

    // 401: user not logged in
    if (res.status == 401) return toast.warning('Please log in to like this post');

    // Other errors.
    console.error('Error toggling like:', res.status);
    return toast.warning('Error toggling like');
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
      <MotionIconButton
        icon={<Heart className='h-5 w-5' />}
        ariaLabel='like toggle'
        type='button'
        onClick={handleLikeToggle}
        className={liked ? 'text-red-500' : 'text-muted-foreground'}
        disabled={loading}
      />
      {/* Like count */}
      <span className='text-muted-foreground text-md font-medium'>{count}</span>
    </div>
  );
};

export default Likes;
