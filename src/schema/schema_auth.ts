/**
 * @file schema_auth.ts
 * @description Schemas for auth-related requests using Zod.
 */

import { z, ZodTypeAny } from 'zod';

import {
  DateTimeSchema,
  OauthProvidersSchema,
  UrlSchema,
  UsernameSchema,
  UUIDSchema,
} from './schema_components';

//
// Schema components
//

const deviceIdSchema = z
  .string()
  .trim()
  .min(16)
  .max(128)
  .regex(/^[a-fA-F0-9]+$/, 'Invalid device ID');

/**
 * @summary A legal username should be:
 * - DateTime in ISO 8601 format
 * - Cannot be in the future
 */
const consentAtSchema = DateTimeSchema.refine((val: string) => new Date(val) <= new Date(), {
  message: 'consentAt cannot be in the future',
});

/**
 * @summary A legal password should be:
 * - 8-20 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - No spaces
 */
const passwordSchema = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).+$/,
    'Password must include uppercase, lowercase, number and special character',
  );

/**
 * @summary We validate the password confirmation in PasswordConfirmationSchema
 */
const confirmPasswordSchema = z.string().trim();

const tokenSchema = z.string().trim().min(20);

/**
 * @summary A password confirmation schema
 * - Validates that the password and confirmPassword fields match
 * @param schema - The schema to refine.
 * The schema must be a ZodTypeAny and should have an input type of
 * { password: string; confirmPassword: string }.
 * @returns A refined schema
 */
const passwordConfirmationSchema = <
  T extends ZodTypeAny & z.ZodType<{ password: string; confirmPassword: string }>,
>(
  schema: T,
) => {
  return schema.refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
};

//
// Request Schemas
//

const RegisterBodySchema = passwordConfirmationSchema(
  z.object({
    username: UsernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    consentAt: consentAtSchema,
    deviceId: deviceIdSchema,
  }),
);

const LoginBodySchema = z.object({
  username: UsernameSchema,
  password: passwordSchema,
  deviceId: deviceIdSchema,
});

const ChangePasswordBodySchema = passwordConfirmationSchema(
  z.object({
    currentPassword: passwordSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    deviceId: deviceIdSchema,
  }),
).refine((data) => data.currentPassword !== data.password, {
  message: 'New password must be different from current password',
  path: ['password'],
});

const SetPasswordBodySchema = passwordConfirmationSchema(
  z.object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    deviceId: deviceIdSchema,
  }),
);

const RefreshTokenBodySchema = z.object({
  refreshToken: tokenSchema,
  deviceId: deviceIdSchema,
});

const JoinAdminBodySchema = z.object({
  referenceCode: z.string().trim().uuid('Invalid reference code format'),
  deviceId: deviceIdSchema,
});

const OAuthProviderParamSchema = z.object({
  provider: OauthProvidersSchema,
});

const OAuthConsentQuerySchema = z.object({
  consentAt: consentAtSchema,
  deviceId: deviceIdSchema,
  redirectTo: z.string().trim().optional(),
});

const DeviceIdBodySchema = z.object({
  deviceId: deviceIdSchema.optional(),
});

const UserNameBodySchema = z.object({
  username: UsernameSchema,
});

const OauthStateSchema = z.object({
  userId: UUIDSchema.optional().nullable(),
  deviceId: deviceIdSchema,
  consentAt: consentAtSchema,
});

const OauthUserInfoSchema = z.object({
  provider: OauthProvidersSchema,
  id: z.string().trim(),
  avatar: UrlSchema.optional(),
});

//
// Response Schemas
//

const AuthResponseSchema = z.object({
  accessToken: tokenSchema,
  refreshToken: tokenSchema,
  id: UUIDSchema,
  username: UsernameSchema,
  avatarUrl: UrlSchema.nullable(),
  isAdmin: z.boolean(),
  oauthProviders: OauthProvidersSchema.array(),
  hasPassword: z.boolean(),
});

const TokenRefreshResponseSchema = z.object({
  accessToken: tokenSchema,
  refreshToken: tokenSchema,
});

const OAuthRedirectResponseSchema = z.object({
  redirectUrl: z.string().trim(),
});

export {
  AuthResponseSchema,
  ChangePasswordBodySchema,
  DeviceIdBodySchema,
  JoinAdminBodySchema,
  LoginBodySchema,
  OAuthConsentQuerySchema,
  OAuthProviderParamSchema,
  OAuthRedirectResponseSchema,
  OauthStateSchema,
  OauthUserInfoSchema,
  RefreshTokenBodySchema,
  RegisterBodySchema,
  SetPasswordBodySchema,
  TokenRefreshResponseSchema,
  UserNameBodySchema,
};

//
// Inferred Types
//

type RegisterBody = z.infer<typeof RegisterBodySchema>;

type LoginBody = z.infer<typeof LoginBodySchema>;

type ChangePasswordBody = z.infer<typeof ChangePasswordBodySchema>;

type SetPasswordBody = z.infer<typeof SetPasswordBodySchema>;

type RefreshTokenBody = z.infer<typeof RefreshTokenBodySchema>;

type JoinAdminBody = z.infer<typeof JoinAdminBodySchema>;

type OAuthProviderParam = z.infer<typeof OAuthProviderParamSchema>;

type OAuthConsentQuery = z.infer<typeof OAuthConsentQuerySchema>;

type AuthResponse = z.infer<typeof AuthResponseSchema>;

type TokenRefreshResponse = z.infer<typeof TokenRefreshResponseSchema>;

type DeviceIdBody = z.infer<typeof DeviceIdBodySchema>;

type UserNameBody = z.infer<typeof UserNameBodySchema>;

type OauthState = z.infer<typeof OauthStateSchema>;

type OauthUserInfo = z.infer<typeof OauthUserInfoSchema>;

type OAuthRedirectResponse = z.infer<typeof OAuthRedirectResponseSchema>;

export type {
  AuthResponse,
  ChangePasswordBody,
  DeviceIdBody,
  JoinAdminBody,
  LoginBody,
  OAuthConsentQuery,
  OAuthProviderParam,
  OAuthRedirectResponse,
  OauthState,
  OauthUserInfo,
  RefreshTokenBody,
  RegisterBody,
  SetPasswordBody,
  TokenRefreshResponse,
  UserNameBody,
};
