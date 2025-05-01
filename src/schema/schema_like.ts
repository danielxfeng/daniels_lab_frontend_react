/**
 * @file schema_like.ts
 * @description The definition of like DTOs.
 * This file contains the schemas for the parameters and responses of the like routes.
 */

import { z } from "zod";

//
// Response Schemas
//

/**
 * @summary Schema for the like status response.
 */
export const LikeStatusResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  liked: z.boolean(),
});

// Inferred the type

/**
 * @summary Type for the like status response
 */
export type LikeStatusResponse = z.infer<typeof LikeStatusResponseSchema>;
