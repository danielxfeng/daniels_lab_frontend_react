/**
 * @file schema_components.ts
 * @description Some common schemas.
 */

import { z } from 'zod';

const DateTimeSchema = z.string().trim().datetime({ message: 'Invalid date format' });

const UUIDSchema = z.string().trim().toLowerCase().uuid('Invalid UUID format');

/**
 * @summary A legal username should be:
 * - 3–16 characters
 * - Letters, numbers, dots, hyphens, or underscores
 */
const UsernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(16)
  .regex(/^[a-zA-Z0-9._-]+$/, {
    message: 'Username must contain only letters, numbers, dots, hyphens, or underscores',
  });

const UrlSchema = z
  .string()
  .trim()
  .url()
  .min(15)
  .max(200)
  .refine((url) => url.startsWith('https://'), {
    message: 'URL must start with https://',
  });

const ConsentSchema = z.literal(true);

const OauthProviderValues = ['google', 'github', 'linkedin'] as const;

type OauthProvider = (typeof OauthProviderValues)[number];

const OauthProvidersSchema = z.enum(OauthProviderValues);

/**
 * @summary A legal offset should be:
 * - 0 or greater
 * - Default is 0
 */
const OffsetSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => {
    const parsed = Number(val || '0');
    return parsed;
  })
  .refine((val) => Number.isInteger(val) && val >= 0, {
    message: 'Offset must be an integer and >= 0',
  });

const OffsetOutputSchema = z.number();

const LimitSchema = z
  .string()
  .trim()
  .optional()
  .transform((val) => {
    const parsed = Number(val || '10');
    return parsed;
  })
  .refine((val) => Number.isInteger(val) && val > 0 && val <= 50, {
    message: 'Limit must be an integer and between 1 and 50',
  });

const LimitOutputSchema = z.number();

const TotalOutputSchema = z.number();

const PostIdSchema = UUIDSchema;

const PostSlugSchema = z.string().min(1, 'Slug is required');

const CreateAtSchema = DateTimeSchema.optional();

const UpdateAtSchema = DateTimeSchema.optional();

const PostIdQuerySchema = z.object({
  postId: PostIdSchema,
});

const PostSlugQuerySchema = z.object({
  slug: PostSlugSchema,
});

const AuthorIdSchema = UUIDSchema;

export {
  AuthorIdSchema,
  ConsentSchema,
  CreateAtSchema,
  DateTimeSchema,
  LimitOutputSchema,
  LimitSchema,
  OauthProvidersSchema,
  OauthProviderValues,
  OffsetOutputSchema,
  OffsetSchema,
  PostIdQuerySchema,
  PostIdSchema,
  PostSlugQuerySchema,
  PostSlugSchema,
  TotalOutputSchema,
  UpdateAtSchema,
  UrlSchema,
  UsernameSchema,
  UUIDSchema,
};

//
// Inferred types
//

type PostIdQuery = z.infer<typeof PostIdQuerySchema>;

type PostSlugQuery = z.infer<typeof PostSlugQuerySchema>;

export type { OauthProvider, PostIdQuery, PostSlugQuery };
