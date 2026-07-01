import { z } from "zod";

const imagePathOrUrl = z.string().max(500).refine(
  (value) => value.startsWith("/") || /^https?:\/\//.test(value),
  "Must be a local image path or HTTP(S) URL"
);

export const experienceSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).optional(),
  description: z.string().max(1000).nullable(),
  featuredImage: imagePathOrUrl.nullable(),
  icon: z.string().max(50).nullable(),
  travelStyles: z.array(z.string()).max(10),
  estimatedBudget: z.coerce.number().min(0).nullable(),
  durationRange: z.string().max(50).nullable(),
  difficultyLevel: z.string().max(50).nullable(),
  tags: z.array(z.string()).max(20),
  featured: z.boolean().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]).optional(),
});
