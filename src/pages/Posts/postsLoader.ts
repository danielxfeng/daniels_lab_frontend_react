import {
  throwWithAxiosErr,
  throwWithUserValidationErr,
  throwWithValidationErr,
} from '@/lib/throwWithErr';
import urlParamSafeParser from '@/lib/urlParamSafeParser';
import {
  GetPostListQuerySchema,
  KeywordSearchQuerySchema,
  PostListResponse,
  PostListResponseSchema,
} from '@/schema/schema_post';
import { TagsResponse, TagsResponseSchema } from '@/schema/schema_tag';
import { getHotTags } from '@/services/service_tags';
import { getPosts, searchPostsByKeywords } from '@/services/services_posts';

const postsLoader = async ({
  request,
}: {
  request: Request;
}): Promise<{
  postsListRes: PostListResponse;
  hotTags: TagsResponse;
  keyword: string | undefined;
}> => {
  // Get the URL and search parameters from the request
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const isSearchByKeyword = url.pathname.includes('search');

  // For requests from `search``
  if (isSearchByKeyword) {
    const validated = KeywordSearchQuerySchema.safeParse(urlParamSafeParser(searchParams));
    if (!validated.success)
      return throwWithUserValidationErr('validate search params with keyword', validated.error);
  }

  // For requests from `listing`
  if (!isSearchByKeyword && searchParams) {
    const validated = GetPostListQuerySchema.safeParse(urlParamSafeParser(searchParams));
    if (!validated.success)
      return throwWithUserValidationErr('validate search params', validated.error);
  }

  // Fetch posts and hot tags concurrently
  const [postsListRes, hotTagsRes] = await Promise.all([
    isSearchByKeyword
      ? searchPostsByKeywords(url.searchParams.toString())
      : getPosts(url.searchParams.toString()),
    getHotTags(),
  ]);

  // Handle response errors
  if (postsListRes.status !== 200) return throwWithAxiosErr('fetch posts', postsListRes);
  if (hotTagsRes.status !== 200) return throwWithAxiosErr('fetch hot tags', hotTagsRes);

  // Validate the response data
  const validatedPosts = PostListResponseSchema.safeParse(postsListRes.data);
  if (!validatedPosts.success)
    return throwWithValidationErr('validate posts', validatedPosts.error);

  const validatedHotTags = TagsResponseSchema.safeParse(hotTagsRes.data);
  if (!validatedHotTags.success)
    return throwWithValidationErr('validate hot tags', validatedHotTags.error);

  // Return the validated data
  return {
    postsListRes: validatedPosts.data,
    hotTags: validatedHotTags.data,
    keyword: isSearchByKeyword ? searchParams.get('keyword') || undefined : undefined,
  };
};

export default postsLoader;
