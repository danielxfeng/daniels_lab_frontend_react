import { AxiosResponse } from 'axios';
import { PostListResponse } from '../schema/schema_post';
import { anonymousAxios } from '@/lib/axiosInstance';

/**
 * @summary A function to get posts by keyword
 * @param query - The string query parameters for the search like `limit=10&offset=0`
 * @returns
 */
const getPostsByKeyword = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios.get(`/blog/posts/search?${query}`);
};

/**
 * @summary A function to get posts
 * @param query - The string query parameters for the search like `limit=10&offset=0`
 * @returns
 */
const getPosts = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios.get(`/blog/posts?${query}`);
};

export { getPostsByKeyword, getPosts };
