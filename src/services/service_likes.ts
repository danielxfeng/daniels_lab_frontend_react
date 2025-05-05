import { AxiosResponse } from 'axios';
import { optAxios } from '@/lib/axiosInstance';
import { LikeStatusResponse } from '@/schema/schema_like';

/**
 * @summary A function to get the like status of a post.
 * @param postId - The ID of the post to get the like status for.
 * @returns
 */
const getLikeStatus = async (postId: string): Promise<AxiosResponse<LikeStatusResponse>> => {
  return await optAxios.get(`/api/blog/likes/?postId=${postId}`);
};

/**
 * @summary A function to like a post.
 * @param postId - The ID of the post to like.
 * @returns 
 */
const likePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await optAxios.post(`/api/blog/likes/?postId=${postId}`);
};

/**
 * @summary A function to unlike a post.
 * @param postId - The ID of the post to unlike.
 * @returns 
 */
const unlikePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await optAxios.delete(`/api/blog/likes/?postId=${postId}`);
};

export { getLikeStatus, likePost, unlikePost };
