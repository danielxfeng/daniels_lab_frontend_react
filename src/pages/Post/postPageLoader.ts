import {
  throwWithAxiosErr,
  throwWithUserValidationErr,
  throwWithValidationErr,
} from '@/lib/throwWithErr';
import { PostSlugQuerySchema } from '@/schema/schema_components';
import { PostResponse, PostResponseSchema } from '@/schema/schema_post';
import { getPost } from '@/services/services_posts';
import type { LoaderFunctionArgs } from 'react-router-dom';

/**
 * @summary A loader function for post page.
 * @description This function is used to fetch a post by slug from the server.
 * @param params - The URL parameters containing the slug of the post.
 * @returns
 */
const postPage = async ({ params }: LoaderFunctionArgs): Promise<{ post: PostResponse }> => {
  // validate user input
  const validatedSlug = PostSlugQuerySchema.safeParse(params);
  if (!validatedSlug.success)
    return throwWithUserValidationErr('validate slug error', JSON.stringify(validatedSlug.error));
  const slug = validatedSlug.data;

  // get post by slug
  const rawPostRes = await getPost(slug.slug);

  // validate post response
  if (rawPostRes.status !== 200) return throwWithAxiosErr('fetch post', rawPostRes);
  const validatedPost = PostResponseSchema.safeParse(rawPostRes.data);
  if (!validatedPost.success || !validatedPost.data.markdown)
    return throwWithValidationErr('validate post error', JSON.stringify(validatedPost.error));

  return { post: validatedPost.data };
};

export default postPage;
