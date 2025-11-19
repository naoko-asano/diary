import { expect, test } from "@playwright/test";

import { Status } from "@/generated/prisma";
import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async () => {
  await resetArticles();
});

test("記事一覧が表示されている", async ({ page }) => {
  await seedArticles({
    count: 2,
    articles: [{ status: Status.PUBLISHED }, { status: Status.DRAFT }],
  });
  await page.goto("/admin/articles");

  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("2025/01/01")).toBeVisible();

  await expect(page.getByText("title2")).toBeVisible();
  await expect(page.getByText("2025/01/02")).toBeVisible();
});

test("削除ボタンをクリックすると記事が削除される", async ({ page }) => {
  await seedArticles({
    count: 2,
  });
  await page.goto("/admin/articles");

  const deletingButtons = page.getByRole("button", {
    name: "Delete",
  });

  const lastDeleteButton = deletingButtons.last();

  await expect(deletingButtons).toHaveCount(2);

  await lastDeleteButton.click();

  await expect(
    page.getByText(
      "記事を削除します。 この操作は元に戻せません。よろしいですか？",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Accept" }).click();

  await expect(page).toHaveURL("/admin/articles");
  await expect(page.getByText("Article deleted successfully!")).toBeVisible();
  await expect(deletingButtons).toHaveCount(1);
  await expect(page.getByText("title1")).toHaveCount(0);
  await expect(page.getByText("title2")).toBeVisible();
});

test("1ページにつき15記事が表示される", async ({ page }) => {
  await seedArticles({
    count: 16,
  });
  await page.goto("/admin/articles");

  // 日付が新しい順に表示されている
  await expect(page.getByText("title16", { exact: true })).toBeVisible();
  await expect(page.getByText("title2", { exact: true })).toBeVisible();
  await expect(page.getByText("title1", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "2", exact: true }).click();

  await expect(page).toHaveURL("/admin/articles?page=2");
  await expect(page.getByText("title2", { exact: true })).toHaveCount(0);
  await expect(page.getByText("title1", { exact: true })).toBeVisible();
});

test("追加ボタンをクリックすると記事作成ページに遷移する", async ({ page }) => {
  await page.goto("/admin/articles");

  const plusButton = page.getByRole("link", { name: "Add Article" });
  await expect(plusButton).toBeVisible();
  await plusButton.click();

  await expect(page).toHaveURL("/admin/articles/new");
});
