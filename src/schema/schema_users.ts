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

const userIdSchema = z.string().trim().uuid('Invalid user ID');

//
// Request Schemas
//

const UpdateUserBodySchema = z.object({
  username: UsernameSchema,
});

const UserIdParamSchema = z.object({
  userId: userIdSchema,
});

//
// Response Schemas
//

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

type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

type UserIdParam = z.infer<typeof UserIdParamSchema>;

type UserResponse = z.infer<typeof UserResponseSchema>;

type UserListResponse = z.infer<typeof UsersResponseSchema>;

export type { UpdateUserBody, UserIdParam, UserListResponse, UserResponse };
