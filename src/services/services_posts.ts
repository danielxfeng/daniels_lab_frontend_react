import { AxiosResponse } from 'axios';
import { CreateOrUpdatePostBody, PostListResponse, PostResponse } from '@/schema/schema_post';
import { anonymousAxios, authAxios } from '@/lib/axiosInstance';

/**
 * @summary A function to get posts by keyword
 * @param query - The string query parameters for the search like `limit=10&offset=0`
 * @returns
 */
const getPostsByKeyword = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios!.get(`/blog/posts/search?${query}`);
};

/**
 * @summary A function to get posts
 * @param query - The string query parameters for the search like `limit=10&offset=0`
 * @returns
 */
const getPosts = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios!.get(`/blog/posts?${query}`);
};

/**
 * @summary A function to get a post by slug
 * @param slug - The slug of the post
 * @returns
 */
const getPost = async (slug: string): Promise<AxiosResponse<PostResponse>> => {
  return await anonymousAxios!.get(`/blog/posts/${slug}`);
};

/**
 * @summary A function to create a post
 * @param body - The body of the post
 * @returns
 */
const createPost = async (body: CreateOrUpdatePostBody): Promise<AxiosResponse<undefined>> => {
  return await authAxios!.post('/blog/posts', body);
};

/**
 * @summary A function to update a post
 * @param id - The id of the post
 * @param body - The body of the post
 * @returns
 */
const updatePost = async (
  id: string,
  body: CreateOrUpdatePostBody,
): Promise<AxiosResponse<PostResponse>> => {
  return await authAxios!.put(`/blog/posts/${id}`, body);
};

/**
 * @summary A function to delete a post
 * @param id - The id of the post
 * @returns
 */
const deletePost = async (id: string): Promise<AxiosResponse<undefined>> => {
  return await authAxios!.delete(`/blog/posts/${id}`);
};

export { getPostsByKeyword, getPosts, getPost, createPost, updatePost, deletePost };
