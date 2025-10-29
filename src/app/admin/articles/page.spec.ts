import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async () => {
  await resetArticles();
});

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await seedArticles(2);
  await page.goto("/admin/articles");

  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("title2")).toBeVisible();
});

test("削除ボタンをクリックすると記事が削除される", async ({ page }) => {
  await seedArticles(2);
  await page.goto("/admin/articles");

  const deletingButtons = page.getByRole("button", {
    name: "Delete",
  });

  const firstDeleteButton = deletingButtons.first();

  await expect(deletingButtons).toHaveCount(2);

  await firstDeleteButton.click();

  await expect(
    page.getByText(
      "記事を削除します。 この操作は元に戻せません。よろしいですか？",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Accept" }).click();

  await expect(deletingButtons).toHaveCount(1);
  await expect(page.getByText("title1")).toHaveCount(0);
  await expect(page.getByText("title2")).toBeVisible();
});

test("1ページにつき15記事が表示される", async ({ page }) => {
  await seedArticles(16);
  await page.goto("/admin/articles");

  await expect(page.getByText("title1", { exact: true })).toBeVisible();
  await expect(page.getByText("title15", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "2", exact: true }).click();

  await expect(page).toHaveURL("/admin/articles?page=2");
  await expect(page.getByText("title15", { exact: true })).toHaveCount(0);
  await expect(page.getByText("title16", { exact: true })).toBeVisible();
});
