import { z } from "zod";

export const articleScheme = z.object({
  title: z.string().trim().min(1).max(255),
  body: z.string().trim().min(1),
});

export function validateArticle(params: { title: string; body: string }) {
  try {
    articleScheme.parse(params);
  } catch (error) {
    throw new Error("Invalid article params\n" + error);
  }
}

export type Article = z.infer<typeof articleScheme>;
