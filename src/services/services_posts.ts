import { AxiosResponse } from 'axios';
import { PostListResponse } from '../schema/schema_post';
import { anonymousAxios } from '@/lib/axios_instance';

/**
 * @summary A function to get posts by keyword
 * @param query - The query parameters for the search
 * @returns
 */
const getPostsByKeyword = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios.get(`/blog/posts/search${query}`, {
    params: query,
  });
};

/**
 * @summary A function to get posts
 * @param query - The query parameters for the search
 * @returns 
 */
const getPosts = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios.get(`/blog/posts`, {
    params: query,
  });
};

export { getPostsByKeyword, getPosts };
