import { expect, test } from "@playwright/test";

import prisma from "@/lib/database";
import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await resetArticles();
  await seedArticles();
  const firstArticle = await prisma.article.findFirst();
  await page.goto(`/articles/${firstArticle?.id}`);
});

test("タイトルと日付と本文が正しく表示される", async ({ page }) => {
  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("2025/01/01")).toBeVisible();
  await expect(page.getByText("body1")).toBeVisible();
});

test("記事が見つからない場合、404ページが表示される", async ({ page }) => {
  await page.goto("/articles/9999");
  await expect(page.getByText("Not Found")).toBeVisible();
});
