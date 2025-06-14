/**
 * @file schema_components.ts
 * @description Some common schemas.
 */

import { z } from 'zod';

/**
 * @summary DateTime schema requires a valid date time format.
 */
const DateTimeSchema = z.string().trim().datetime({ message: 'Invalid date format' });

/**
 * @summary UUID schema requires a valid UUID format.
 */
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

/**
 * @summary A legal avatar URL should be:
 * - Valid URL
 * - 15–200 characters long
 * - Must start with https://
 */
const UrlSchema = z
  .string()
  .trim()
  .url()
  .min(15)
  .max(200)
  .refine((url) => url.startsWith('https://'), {
    message: 'URL must start with https://',
  });

/**
 * @summary Consent to terms and conditions
 * - Must be true
 */
const ConsentSchema = z.literal(true);

/**
 * @summary OAuth providers
 */
const OauthProviderValues = ['google', 'github', 'linkedin'] as const;

/**
 * @summary OAuth provider type
 */
type OauthProvider = (typeof OauthProviderValues)[number];

/**
 * @summary OAuth providers schema
 * - Either 'google' or 'github'
 */
const OauthProvidersSchema = z.enum(OauthProviderValues);

/**
 * @summary A legal offset should be:
 * - 0 or greater
 * - Default is 0
 * - Used for pagination
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

/**
 * @summary A output offset
 */
const OffsetOutputSchema = z.number();

/**
 * @summary A legal limit should be:
 * - 1-50
 * - Default is 10
 * - Used for pagination
 */
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

/**
 * @summary A output limit
 */
const LimitOutputSchema = z.number();

/**
 * @summary A output total
 */
const TotalOutputSchema = z.number();

/**
 * @summary Post ID schema
 * - Must be a valid UUID
 */
const PostIdSchema = UUIDSchema;

/**
 * @summary Post Slug schema
 * - Slug is required
 * - Slug must be lowercase
 * - Slug can only contain lowercase letters, numbers, and hyphens
 * - Slug must start with a lowercase letter or number
 */
const PostSlugSchema = z.string().min(1, 'Slug is required');

/**
 * @summary CreateAt schema
 * - Optional date time
 * - Used for creation date
 */
const CreateAtSchema = DateTimeSchema.optional();

/**
 * @summary UpdateAt schema
 * - Optional date time
 * - Used for update date
 */
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

/**
 * @summary Schema for the post ID parameter
 */
type PostIdQuery = z.infer<typeof PostIdQuerySchema>;

/**
 * @summary Schema for the post slug parameter
 */
type PostSlugQuery = z.infer<typeof PostSlugQuerySchema>;

export type { OauthProvider, PostIdQuery, PostSlugQuery };
