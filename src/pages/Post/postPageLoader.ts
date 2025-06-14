import type { LoaderFunctionArgs } from 'react-router-dom';

import { fetchPost } from '@/lib/fetchPost';
import { PostResponse } from '@/schema/schema_post';

/**
 * @summary A loader function for post page.
 * @description This function is used to fetch a post by slug from the server.
 * @param params - The URL parameters containing the slug of the post.
 * @returns
 */
const postPage = async ({ params }: LoaderFunctionArgs): Promise<{ post: PostResponse }> => {
  return await fetchPost(params.slug as string);
};

export default postPage;
