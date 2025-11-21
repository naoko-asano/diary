import { z } from "zod";

import { $Enums, Article as OriginalArticle } from "@/generated/prisma";

export const Status = $Enums.Status;

export const articleScheme = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "1文字以上入力してください" })
    .max(255, { message: "255文字以内で入力してください" }),
  body: z.string().trim().min(1, { message: "1文字以上入力してください" }),
  date: z.coerce.date("日付を選択してください"),
  status: z.enum(Status),
  featuredImageUrl: z.string().nullable(),
});

export function validateArticle(params: ArticleParams) {
  try {
    articleScheme.parse(params);
  } catch (error) {
    throw new Error("Invalid article params\n" + error);
  }
}

export type Article = OriginalArticle;
export type ArticleParams = z.infer<typeof articleScheme>;
