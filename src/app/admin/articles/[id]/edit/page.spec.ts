import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/articles/1/edit");
});

test("記事の編集ページが表示される", async ({ page }) => {
  await expect(page.getByText("Article Editing Page")).toBeVisible();
  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("body1")).toBeVisible();
});
