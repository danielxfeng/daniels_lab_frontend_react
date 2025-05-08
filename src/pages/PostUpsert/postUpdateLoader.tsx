import { LoaderFunctionArgs, redirect } from 'react-router';
import useUserStore from '@/stores/useUserStore';
import { fetchPost } from '@/lib/fetchPost';

// Loader for the post update page.
// ABAC and response validation are needed in Page.
const PostUpdatePage = async ({ params, request }: LoaderFunctionArgs) => {
  const { getUserStatus, user } = useUserStore.getState();

  const url = new URL(request.url);

  // RBAC
  if (!getUserStatus() || !user)
    return redirect(`/user/login?from=${encodeURIComponent(url.pathname)}`);

  // Skip fetching post if skipAuth is true
  if (url.searchParams.get('skipAuth') === 'true') return null;

  const slug = params.slug as string;
  return await fetchPost(slug);
};

export default PostUpdatePage;
