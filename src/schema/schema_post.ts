/**
 * @file schema_post.ts
 * @description The definition of post DTOs.
 * This file contains the schemas for the parameters and responses of the post routes.
 */

import { z } from "zod";
import {
  OffsetSchema,
  LimitSchema,
  DateTimeSchema,
  PostSlugSchema,
  UsernameSchema,
  AvatarUrlSchema,
  UUIDSchema,
  CreateAtSchema,
  UpdateAtSchema,
  TotalOutputSchema,
  OffsetOutputSchema,
  LimitOutputSchema,
  PostIdSchema,
} from "./schema_components";

import { tagsSchema } from "./schema_tag";

//
// Schema Components
//

const titleSchema = z.string().trim().min(1).max(100)

const titleReturnSchema = z.string().trim().min(1)

const markdownSchema = z.string().trim().min(1).max(20000)

const excerptSchema = z.string()

//
// Request Schemas
//

/**
 * @summary Query parameters for fetching a list of posts.
 */
const GetPostListQuerySchema = z.object({
  offset: OffsetSchema,
  limit: LimitSchema,
  tags: tagsSchema,
  from: DateTimeSchema.optional(),
  to: DateTimeSchema.optional(),
});

/**
 * @summary Request body for creating or updating a post.
 */
const CreateOrUpdatePostBodySchema = z.object({
  title: titleSchema,
  markdown: markdownSchema,
  tags: tagsSchema,
  createdAt: CreateAtSchema.optional(),
  updatedAt: UpdateAtSchema.optional(),
});

//
// Response Schemas
//

/**
 * @summary Schema for a single post response.
 */
const PostResponseSchema = z.object({
  id: PostIdSchema,
  title: titleReturnSchema,
  slug: PostSlugSchema,
  excerpt: excerptSchema,
  markdown: markdownSchema,
  tags: tagsSchema,
  authorId: UUIDSchema,
  authorName: UsernameSchema,
  authorAvatar: AvatarUrlSchema.nullable(),
  createdAt: CreateAtSchema,
  updatedAt: UpdateAtSchema,
});

/**
 * @summary Schema for a list of posts.
 */
const PostListResponseSchema = z.object({
  posts: z.array(PostResponseSchema),
  total: TotalOutputSchema,
  offset: OffsetOutputSchema,
  limit: LimitOutputSchema,
});

//
// For ElasticSearch
//

const KeywordSearchQuerySchema = z.object({
  keyword: z.string().min(1).max(100),
  offset: OffsetSchema,
  limit: LimitSchema,
});

export {
  GetPostListQuerySchema,
  CreateOrUpdatePostBodySchema,
  KeywordSearchQuerySchema,
  PostResponseSchema,
  PostListResponseSchema,
};

// Inferred the types

/**
 * @summary Schema for the query parameters of the post list
 */
type GetPostListQuery = z.infer<typeof GetPostListQuerySchema>;

/**
 * @summary Schema for the body parameters of creating or updating a post
 */
type CreateOrUpdatePostBody = z.infer<typeof CreateOrUpdatePostBodySchema>;

/**
 * @summary Schema for the validated post response
 */
type PostResponse = z.infer<typeof PostResponseSchema>;

/**
 * @summary Schema for the validated post list response
 */
type PostListResponse = z.infer<typeof PostListResponseSchema>;

/**
 * @summary Schema for the validated keyword search query
 */
type KeywordSearchQuery = z.infer<typeof KeywordSearchQuerySchema>;

export type {
  GetPostListQuery,
  CreateOrUpdatePostBody,
  PostResponse,
  PostListResponse,
  KeywordSearchQuery,
};
