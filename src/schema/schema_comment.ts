/**
 * @file schema_comment.ts
 * @description The definition of comment DTOs.
 * This file contains the schemas for the parameters and responses of the comment routes.
 */
import { z } from 'zod';

import {
  AuthorIdSchema,
  CreateAtSchema,
  LimitOutputSchema,
  LimitSchema,
  OffsetOutputSchema,
  OffsetSchema,
  PostIdSchema,
  TotalOutputSchema,
  UpdateAtSchema,
  UrlSchema,
  UsernameSchema,
  UUIDSchema,
} from './schema_components';

//
// Schema components
//

const commentContentSchema = z.string().trim().min(1).max(500);

const commentIdSchema = UUIDSchema;

//
// Request Schemas
//

const GetCommentsQuerySchema = z.object({
  postId: PostIdSchema,
  offset: OffsetSchema,
  limit: LimitSchema,
});

const CreateCommentBodySchema = z.object({
  postId: PostIdSchema,
  content: commentContentSchema,
});

const UpdateCommentBodySchema = z.object({
  content: commentContentSchema,
});

const CommentIdParamSchema = z.object({
  commentId: commentIdSchema,
});

//
// Response Schemas
//

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

const CommentsListResponseSchema = z.object({
  comments: z.array(CommentResponseSchema),
  total: TotalOutputSchema,
  offset: OffsetOutputSchema,
  limit: LimitOutputSchema,
});

export {
  CommentIdParamSchema,
  CommentResponseSchema,
  CommentsListResponseSchema,
  CreateCommentBodySchema,
  GetCommentsQuerySchema,
  UpdateCommentBodySchema,
};

// Inferred Types

type GetCommentsQuery = z.infer<typeof GetCommentsQuerySchema>;

type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;

type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;

type CommentIdParam = z.infer<typeof CommentIdParamSchema>;

type CommentResponse = z.infer<typeof CommentResponseSchema>;

type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

export type {
  CommentIdParam,
  CommentResponse,
  CommentsListResponse,
  CreateCommentBody,
  GetCommentsQuery,
  UpdateCommentBody,
};
