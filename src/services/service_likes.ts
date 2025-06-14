import { AxiosResponse } from 'axios';

import { authAxios, optAxios } from '@/lib/axiosInstance';
import { LikeStatusResponse } from '@/schema/schema_like';

/**
 * @summary A function to get the like status of a post.
 * @param postId - The ID of the post to get the like status for.
 * @returns
 */
const getLikeStatus = async (postId: string): Promise<AxiosResponse<LikeStatusResponse>> => {
  const params = new URLSearchParams({ postId });
  return await optAxios!.get(`/blog/likes/?${params.toString()}`);
};

/**
 * @summary A function to like a post.
 * @param postId - The ID of the post to like.
 * @returns
 */
const likePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await authAxios!.post(`/blog/likes/`, { postId });
};

/**
 * @summary A function to unlike a post.
 * @param postId - The ID of the post to unlike.
 * @returns
 */
const unlikePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await authAxios!.delete(`/blog/likes/`, {
    data: { postId },
  });
};

export { getLikeStatus, likePost, unlikePost };
