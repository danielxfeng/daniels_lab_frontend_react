import { AxiosResponse } from 'axios';
import { PostListResponse, PostResponse } from '@/schema/schema_post';
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

/**
 * @summary A function to get a post by slug
 * @param slug - The slug of the post
 * @returns
 */
const getPost = async (slug: string): Promise<AxiosResponse<PostResponse>> => {
  return await anonymousAxios.get(`/blog/posts/${slug}`);
};

export { getPostsByKeyword, getPosts, getPost };
