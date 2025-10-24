import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.beforeAll(async () => {
  await resetArticles();
  await seedArticles();
});

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("title2")).toBeVisible();
});
