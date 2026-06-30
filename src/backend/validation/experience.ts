import { z } from "zod";

export const experienceSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().optional(),
  description: z.string().nullable().optional(),
  featuredImage: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  travelStyles: z.array(z.string()).optional(),
  estimatedBudget: z.coerce.number().min(0).nullable().optional(),
  durationRange: z.string().nullable().optional(),
  difficultyLevel: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
});
