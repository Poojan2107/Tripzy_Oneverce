import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().optional(),
  country: z.string().min(2),
  city: z.string().min(1),
  region: z.string().nullable().optional(),
  description: z.string().min(10),
  price: z.coerce.number().min(0).optional(),
  duration: z.string().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  groupSize: z.string().nullable().optional(),
  featured: z.coerce.boolean().optional(),
  trending: z.coerce.boolean().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  adventureScore: z.coerce.number().int().min(0).max(100).optional(),
  culturalScore: z.coerce.number().int().min(0).max(100).optional(),
  luxuryScore: z.coerce.number().int().min(0).max(100).optional(),
  familyScore: z.coerce.number().int().min(0).max(100).optional(),
  foodScore: z.coerce.number().int().min(0).max(100).optional(),
  hiddenGemScore: z.coerce.number().int().min(0).max(100).optional(),
  bestMonths: z.array(z.string()).optional(),
  travelStyles: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
