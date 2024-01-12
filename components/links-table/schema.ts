import { z } from "zod";

export const linkSchema = z.object({
  id: z.string(),
  href: z.string(),
  slug: z.string(),
  visits: z.number(),
  createAt: z.string(),
});
