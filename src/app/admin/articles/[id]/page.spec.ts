import { expect, test } from "@playwright/test";

import {
  fetchLatestArticleId,
  resetArticles,
  seedArticles,
} from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await resetArticles();
  await seedArticles();

  const latestArticleId = await fetchLatestArticleId();
  await page.goto(`admin/articles/${latestArticleId}`);
});

test("タイトルと日付と本文が正しく表示される", async ({ page }) => {
  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("2025/01/01")).toBeVisible();
  await expect(page.getByText("body1")).toBeVisible();
});

test("記事が存在しないidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/9999");
  expect(response?.status()).toBe(404);
});

test("不正なidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/invalid");
  expect(response?.status()).toBe(404);
});
