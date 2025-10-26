import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async () => {
  await resetArticles();
});

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await seedArticles(2);
  await page.goto("/");

  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("title2")).toBeVisible();
});

test("1ページにつき15記事が表示される", async ({ page }) => {
  await seedArticles(16);
  await page.goto("/");

  await expect(page.getByText("title1", { exact: true })).toBeVisible();
  await expect(page.getByText("title15", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "2", exact: true }).click();

  await expect(page).toHaveURL("/?page=2");
  await expect(page.getByText("title15", { exact: true })).toHaveCount(0);
  await expect(page.getByText("title16", { exact: true })).toBeVisible();
});
