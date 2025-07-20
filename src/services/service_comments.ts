import { AxiosResponse } from 'axios';

import { anonymousAxios, authAxios } from '@/lib/axiosInstance';
import {
  CommentResponse,
  CommentsListResponse,
  CreateCommentBody,
  UpdateCommentBody,
} from '@/schema/schema_comment';

const getComments = async (
  postId: string,
  offset: number,
  limit: number,
): Promise<AxiosResponse<CommentsListResponse>> => {
  const params = new URLSearchParams({
    postId,
    offset: offset.toString(),
    limit: limit.toString(),
  });
  return await anonymousAxios!.get(`/blog/comments/?${params.toString()}`);
};

const getComment = async (commentId: string): Promise<AxiosResponse<CommentResponse>> => {
  return await anonymousAxios!.get(`/blog/comments/${commentId}`);
};

const createComment = async (body: CreateCommentBody) => {
  return await authAxios!.post('/blog/comments', body);
};

const updateComment = async (commentId: string, body: UpdateCommentBody) => {
  return await authAxios!.put(`/blog/comments/${commentId}`, body);
};

const deleteComment = async (commentId: string) => {
  return await authAxios!.delete(`/blog/comments/${commentId}`);
};

export { createComment, deleteComment, getComment, getComments, updateComment };
