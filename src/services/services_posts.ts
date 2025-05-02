import { AxiosResponse } from 'axios';
import { KeywordSearchQuery, PostListResponse } from '../schema/schema_post';
import { anonymousAxios } from '@/lib/axios_instance';

/**
 * @summary A function to get posts by keyword
 * @param query - The query parameters for the search
 * @returns 
 */
const getPostsByKeyword = async (
  query: KeywordSearchQuery,
): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios.get('/posts/search', {
    params: query,
  });
};

export { getPostsByKeyword };
