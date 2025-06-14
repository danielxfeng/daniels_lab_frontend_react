/**
 * @file schema_users.ts
 * @description The definition of user DTOs.
 * This file contains the schemas for the parameters and responses of the user routes.
 */

import { z } from 'zod';

import {
  CreateAtSchema,
  OauthProvidersSchema,
  UpdateAtSchema,
  UrlSchema,
  UsernameSchema,
} from './schema_components';

//
// Schema components
//

/**
 * @summary A legal user ID should be:
 * - UUID format
 */
const userIdSchema = z.string().trim().uuid('Invalid user ID');

//
// Request Schemas
//

/**
 * @summary Request body for updating current user info.
 */
const UpdateUserBodySchema = z.object({
  username: UsernameSchema,
});

/**
 * @summary Path parameter schema for userId.
 */
const UserIdParamSchema = z.object({
  userId: userIdSchema,
});

//
// Response Schemas
//

/**
 * @summary Schema for the user response, including:
 * - id, username, avatarUrl, oauthProviders, isAdmin, createdAt, updatedAt, consentAt
 */
const UserResponseSchema = z.object({
  id: userIdSchema,
  username: UsernameSchema,
  avatarUrl: UrlSchema.nullable(),
  oauthProviders: OauthProvidersSchema.array(),
  isAdmin: z.boolean(),
  createdAt: CreateAtSchema,
  updatedAt: UpdateAtSchema,
  consentAt: z.string().datetime(),
  hasPassword: z.boolean(),
});

const UsersResponseSchema = z.array(UserResponseSchema);

export { UpdateUserBodySchema, UserIdParamSchema, UserResponseSchema, UsersResponseSchema };

// Inferred the type

/**
 * @summary Schema for the request body to update user info.
 */
type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

/**
 * @summary Schema for the user ID parameter.
 */
type UserIdParam = z.infer<typeof UserIdParamSchema>;

/**
 * @summary Schema for the validated user response
 */
type UserResponse = z.infer<typeof UserResponseSchema>;

/**
 * @summary Schema for the list of users response
 */
type UserListResponse = z.infer<typeof UsersResponseSchema>;

export type { UpdateUserBody, UserIdParam, UserListResponse, UserResponse };
