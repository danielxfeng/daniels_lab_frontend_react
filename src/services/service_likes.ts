import { AxiosResponse } from 'axios';

import { authAxios, optAxios } from '@/lib/axiosInstance';
import { LikeStatusResponse } from '@/schema/schema_like';

const getLikeStatus = async (postId: string): Promise<AxiosResponse<LikeStatusResponse>> => {
  const params = new URLSearchParams({ postId });
  return await optAxios!.get(`/blog/likes/?${params.toString()}`);
};

const likePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await authAxios!.post(`/blog/likes/`, { postId });
};

const unlikePost = async (postId: string): Promise<AxiosResponse<unknown>> => {
  return await authAxios!.delete(`/blog/likes/`, {
    data: { postId },
  });
};

export { getLikeStatus, likePost, unlikePost };
