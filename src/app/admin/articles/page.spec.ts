import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "$e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/articles");
});

test.beforeAll(async () => {
  await resetArticles();
  await seedArticles();
});

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("title2")).toBeVisible();
});

test("削除ボタンをクリックすると記事が削除される", async ({ page }) => {
  const deletingButtons = page.getByRole("button", {
    name: "Delete",
  });

  const firstDeleteButton = deletingButtons.first();

  await expect(deletingButtons).toHaveCount(2);

  await firstDeleteButton.click();

  await expect(
    page.getByText("記事を削除します。よろしいですか？"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Accept" }).click();

  await expect(deletingButtons).toHaveCount(1);
  await expect(page.getByText("title1")).toHaveCount(0);
  await expect(page.getByText("title2")).toBeVisible();
});
