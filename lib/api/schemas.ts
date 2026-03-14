import { z } from "zod";

export const mosqueCreateSchema = z.object({
  name: z.string().min(2).max(120),
  city: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  description: z.string().max(1500).optional(),
});

export const mosqueUpdateSchema = mosqueCreateSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  "At least one field is required for update",
);

export const announcementCreateSchema = z.object({
  title: z.string().min(2).max(160),
  content: z.string().min(1).max(5000),
  publishedAt: z.coerce.date().optional(),
});

export const announcementUpdateSchema = announcementCreateSchema
  .partial()
  .refine((payload) => Object.keys(payload).length > 0, "At least one field is required for update");

export const moderationSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().max(500).optional(),
});
