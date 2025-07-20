import { ZodError, ZodIssueCode } from 'zod';

import { PostSlugQuerySchema } from '@/schema/schema_components';
import { PostResponse, PostResponseSchema } from '@/schema/schema_post';
import { getPost } from '@/services/services_posts';

import {
  throwWithAxiosErr,
  throwWithUserValidationErr,
  throwWithValidationErr,
} from './throwWithErr';

/**
 * A loader helper function for post page.
 */
const fetchPost = async (unsafeSlug: string): Promise<{ post: PostResponse }> => {
  const validatedSlug = PostSlugQuerySchema.safeParse({ slug: unsafeSlug });
  if (!validatedSlug.success)
    return throwWithUserValidationErr('validate slug error', validatedSlug.error);
  const slug = validatedSlug.data;

  // get post by slug
  const rawPostRes = await getPost(slug.slug);

  // validate post response
  if (rawPostRes.status !== 200) return throwWithAxiosErr('fetch post', rawPostRes);
  const validatedPost = PostResponseSchema.safeParse(rawPostRes.data);
  if (!validatedPost.success || !validatedPost.data.markdown) {
    const err = validatedPost.success
      ? new ZodError<PostResponse>([
          {
            code: ZodIssueCode.custom,
            message: 'markdown is missing',
            path: ['markdown'],
          },
        ])
      : validatedPost.error;
    return throwWithValidationErr('validate post error', err);
  }

  return { post: validatedPost.data };
};

export { fetchPost };
