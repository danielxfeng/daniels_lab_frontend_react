/**
 * @file schema_comment.ts
 * @description The definition of comment DTOs.
 * This file contains the schemas for the parameters and responses of the comment routes.
 */
import { z } from 'zod';
import {
  UUIDSchema,
  PostIdSchema,
  UsernameSchema,
  UrlSchema,
  OffsetSchema,
  LimitSchema,
  OffsetOutputSchema,
  LimitOutputSchema,
  CreateAtSchema,
  UpdateAtSchema,
  TotalOutputSchema,
  AuthorIdSchema,
} from './schema_components';

//
// Schema components
//

/**
 * @summary A legal comment should be:
 * - 1-500 characters long
 */
const commentContentSchema = z.string().trim().min(1).max(500);

const commentIdSchema = UUIDSchema;

//
// Request Schemas
//

/**
 * @summary Schema for the query parameters to get comments.
 */
const GetCommentsQuerySchema = z.object({
  postId: PostIdSchema,
  offset: OffsetSchema,
  limit: LimitSchema,
});

/**
 * @summary Schema for the request body to create a comment.
 */
const CreateCommentBodySchema = z.object({
  postId: PostIdSchema,
  content: commentContentSchema,
});

/**
 * @summary Schema for the request body to update a comment.
 */
const UpdateCommentBodySchema = z.object({
  content: commentContentSchema,
});

/**
 * @summary Schema for the comment ID parameter.
 */
const CommentIdParamSchema = z.object({
  commentId: commentIdSchema,
});

//
// Response Schemas
//

/**
 * @summary Schema for the comment response.
 */
const CommentResponseSchema = z.object({
  id: commentIdSchema,
  postId: PostIdSchema,
  authorId: AuthorIdSchema,
  authorName: UsernameSchema,
  authorAvatar: UrlSchema.nullable(),
  content: commentContentSchema,
  createdAt: CreateAtSchema,
  updatedAt: UpdateAtSchema,
});

/**
 * @summary Schema for the list of comments response.
 */
const CommentsListResponseSchema = z.object({
  comments: z.array(CommentResponseSchema),
  total: TotalOutputSchema,
  offset: OffsetOutputSchema,
  limit: LimitOutputSchema,
});

export {
  GetCommentsQuerySchema,
  CreateCommentBodySchema,
  UpdateCommentBodySchema,
  CommentIdParamSchema,
  CommentResponseSchema,
  CommentsListResponseSchema,
};

// Inferred Types

/**
 * @summary Schema for query parameters to get comments.
 */
type GetCommentsQuery = z.infer<typeof GetCommentsQuerySchema>;

/**
 * @summary Schema for body parameters to create a comment.
 */
type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;

/**
 * @summary Schema for body parameters to update a comment.
 */
type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;

/**
 * @summary Schema for comment ID parameters.
 */
type CommentIdParam = z.infer<typeof CommentIdParamSchema>;

/**
 * @summary Schema for the comment response
 */
type CommentResponse = z.infer<typeof CommentResponseSchema>;

/**
 * @summary Schema for the list of comments response
 */
type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

export type {
  GetCommentsQuery,
  CreateCommentBody,
  UpdateCommentBody,
  CommentIdParam,
  CommentResponse,
  CommentsListResponse,
};
