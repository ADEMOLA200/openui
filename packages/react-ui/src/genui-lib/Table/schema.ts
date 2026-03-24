import { z } from "zod";

export const ColSchema = z.object({
  /** Column header label */
  label: z.string(),
  /** Column data — array of values (one per row), provided via array pluck expression */
  data: z.any(),
  /** Optional display type hint */
  type: z.enum(["string", "number", "action"]).optional(),
});
