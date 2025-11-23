import { z } from "zod";

export const createCategorySchema = z.object({
  label: z.string().min(1, "Label is required").max(50, "Label is too long"),
  description: z.string().optional(),
  color: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
