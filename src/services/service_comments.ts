import { AxiosResponse } from 'axios';

import { anonymousAxios, authAxios } from '@/lib/axiosInstance';
import {
  CommentResponse,
  CommentsListResponse,
  CreateCommentBody,
  UpdateCommentBody,
} from '@/schema/schema_comment';

/**
 * @summary A function to get the comments of a post.
 * @param postId - The ID of the post to get the like status for.
 * @returns
 */
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

/**
 * @summary A function to get the comment of a post.
 * @param commentId - The ID of the comment to get the like status for.
 * @returns
 */
const getComment = async (commentId: string): Promise<AxiosResponse<CommentResponse>> => {
  return await anonymousAxios!.get(`/blog/comments/${commentId}`);
};

/**
 * @summary A function to create a comment.
 * @param body - The body of the comment to be created.
 * @returns
 */
const createComment = async (body: CreateCommentBody) => {
  return await authAxios!.post('/blog/comments', body);
};

/**
 * @summary A function to update a comment.
 * @param body - The body of the comment to be updated.
 * @returns
 */
const updateComment = async (commentId: string, body: UpdateCommentBody) => {
  return await authAxios!.put(`/blog/comments/${commentId}`, body);
};

/**
 * @summary A function to delete a comment.
 * @param commentId - The ID of the comment to be deleted.
 * @returns
 */
const deleteComment = async (commentId: string) => {
  return await authAxios!.delete(`/blog/comments/${commentId}`);
};

export { createComment, deleteComment, getComment, getComments, updateComment };
