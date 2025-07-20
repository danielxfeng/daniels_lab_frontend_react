/**
 * @file schema_tag.ts
 * @description The definition of tag DTOs.
 * This file contains the schemas for the parameters and responses of the tag routes.
 */

import { z } from 'zod';

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(20)
  .transform((val) => val.toLowerCase())
  .refine((val) => /^[a-z0-9._-]+$/.test(val), {
    message: 'Tag must contain only letters, numbers, dots, hyphens, or underscores.',
  });

const tagsSchema = z
  .union([tagSchema, z.array(tagSchema)])
  .optional()
  .default([])
  .transform((val) => (Array.isArray(val) ? val : [val]))
  .refine((arr) => arr.length <= 10, {
    message: 'Maximum 10 tags allowed',
  });

const TagQuerySchema = z.object({
  tag: tagSchema,
  ts: z.number(),
});

const TagsResponseSchema = z.object({
  tags: z.array(tagSchema),
  ts: z.number().optional(),
});

export { TagQuerySchema, tagSchema, TagsResponseSchema, tagsSchema };

//
// Inferred Types
//

type TagQuery = z.infer<typeof TagQuerySchema>;
type TagsResponse = z.infer<typeof TagsResponseSchema>;

export type { TagQuery, TagsResponse };
