import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { PostResponse, PostResponseSchema } from '@/schema/schema_post';
import MotionH1 from '@/components/motion_components/MotionH1';
import PostUpsertForm from '@/components/features/post/PostUpsertForm';
import Loading from '@/components/shared/Loading';
import { throwWithValidationErr } from '@/lib/throwWithErr';
import useUserStore from '@/stores/useUserStore';
import siteMeta from '@/constants/siteMeta';
import NotificationBar from '@/components/shared/NotificationBar';

// A page to update a post
const PostUpdatePage = () => {
  const [validatedPost, setValidatedPost] = useState<PostResponse | null>(null);
  const user = useUserStore.getState().user;
  const navigate = useNavigate();
  // post from the loader - from address bar
  const { post } = useLoaderData<{ post: PostResponse | null }>();
  // post from the location state - from post page
  const location = useLocation();
  const postFromState = location.state as PostResponse | undefined;

  // check the loader, then fallback to state
  const rawPost = post || postFromState;

  useEffect(() => {
    if (!rawPost) {
      navigate('/page-not-found', { replace: true });
      return;
    }

    // validate the post
    const validated = PostResponseSchema.safeParse(rawPost);
    if (!validated.success)
      return throwWithValidationErr('validation error', JSON.stringify(validated.error));

    // ABAC
    if (user?.id !== validated.data.authorId) {
      navigate('/page-not-found', { replace: true });
    }

    setValidatedPost(validated.data);
  }, [rawPost, user, navigate]);

  if (!validatedPost) return <Loading />;

  return (
    <div className='inner-container'>
      <title>{`Update a post – ${siteMeta.siteName}`}</title>
      <NotificationBar />
      <MotionH1>Update a post</MotionH1>
      <PostUpsertForm post={validatedPost} />
    </div>
  );
};

export default PostUpdatePage;
