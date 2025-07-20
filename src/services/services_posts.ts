import { AxiosResponse } from 'axios';

import { anonymousAxios, authAxios } from '@/lib/axiosInstance';
import { CreateOrUpdatePostBody, PostListResponse, PostResponse } from '@/schema/schema_post';

const getPostsByKeyword = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios!.get(`/blog/posts/search?${query}`);
};

const getPosts = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios!.get(`/blog/posts?${query}`);
};

const searchPostsByKeywords = async (query: string): Promise<AxiosResponse<PostListResponse>> => {
  return await anonymousAxios!.get(`/blog/posts/search?${query}`);
};

const getPost = async (slug: string): Promise<AxiosResponse<PostResponse>> => {
  return await anonymousAxios!.get(`/blog/posts/${slug}`);
};

const createPost = async (body: CreateOrUpdatePostBody): Promise<AxiosResponse<undefined>> => {
  return await authAxios!.post('/blog/posts', body);
};

const updatePost = async (
  id: string,
  body: CreateOrUpdatePostBody,
): Promise<AxiosResponse<PostResponse>> => {
  return await authAxios!.put(`/blog/posts/${id}`, body);
};

const deletePost = async (id: string): Promise<AxiosResponse<undefined>> => {
  return await authAxios!.delete(`/blog/posts/${id}`);
};

export {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsByKeyword,
  searchPostsByKeywords,
  updatePost,
};
