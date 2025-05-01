/**
 * @file schema_tag.ts
 * @description The definition of tag DTOs.
 * This file contains the schemas for the parameters and responses of the tag routes.
 */

import { z } from "zod";

/**
 * @summary Schema for a tag.
 * Tags can only contain letters, numbers, dots, hyphens, or underscores.
 * The length of each tag must be between 1 and 20 characters.
 * The maximum number of tags is 10.
 */
const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(20)
  .transform((val) => val.toLowerCase())
  .refine((val) => /^[a-z0-9._-]+$/.test(val), {
    message:
      "Tag must contain only letters, numbers, dots, hyphens, or underscores.",
  });

/**
 * @summary Schema for tags.
 * Can be a string, oran array of strings, or undefined.
 * Tags can only contain letters, numbers, dots, hyphens, or underscores.
 * The length of each tag must be between 1 and 20 characters.
 * The maximum number of tags is 10.
 */
const tagsSchema = z
  .union([tagSchema, z.array(tagSchema)])
  .optional()
  .default([])
  .transform((val) => (Array.isArray(val) ? val : [val]))
  .refine((arr) => arr.length <= 10, {
    message: "Maximum 10 tags allowed",
  });

/**
 * @summary Schema for the request body to match a tag list.
 */
const TagQuerySchema = z.object({
  tag: tagSchema,
});

const TagsResponseSchema = z.object({
  tags: z.array(tagSchema),
});

export { tagSchema, tagsSchema, TagQuerySchema, TagsResponseSchema };

//
// Inferred Types
//

type TagQuery = z.infer<typeof TagQuerySchema>;
type TagsResponse = z.infer<typeof TagsResponseSchema>;

export type { TagQuery, TagsResponse };
