import { z } from "zod";

export type Article = ArticleParams & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleParams = z.infer<typeof articleScheme>;

export const Statuses = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
} as const;

export const articleScheme = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "1文字以上入力してください" })
    .max(255, { message: "255文字以内で入力してください" }),
  body: z.string().trim().min(1, { message: "1文字以上入力してください" }),
  date: z.coerce.date("日付を選択してください"),
  status: z.enum(Statuses),
  featuredImageUrl: z.string().nullable(),
});

const defaultFeaturedImageUrl = "/images/default-featured-image.jpg";

export function validateArticle(params: ArticleParams) {
  try {
    articleScheme.parse(params);
  } catch (error) {
    throw new Error("Invalid article params\n" + error);
  }
}

export function isDraft(article: Article): boolean {
  return article.status === Statuses.DRAFT;
}

export function resolveFeaturedImageUrl(article: Article): string {
  return article.featuredImageUrl || defaultFeaturedImageUrl;
}
