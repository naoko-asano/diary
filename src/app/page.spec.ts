import { expect, test } from "@playwright/test";

import { Status } from "@/features/articles/model";
import { resetArticles, seedArticles } from "@e2e/factories/article";

test.beforeEach(async () => {
  await resetArticles();
});

test("公開された記事のみが表示されている", async ({ page }) => {
  await seedArticles({
    count: 2,
    articles: [{ status: Status.PUBLISHED }, { status: Status.DRAFT }],
  });
  await page.goto("/");

  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("2025/01/01")).toBeVisible();

  await expect(page.getByText("title2")).toHaveCount(0);
  await expect(page.getByText("2025/01/02")).toHaveCount(0);
});

test("1ページにつき15記事が表示される", async ({ page }) => {
  await seedArticles({ count: 16 });
  await page.goto("/");

  // 日付が新しい順に表示されている
  await expect(page.getByText("title16", { exact: true })).toBeVisible();
  await expect(page.getByText("title2", { exact: true })).toBeVisible();
  await expect(page.getByText("title1", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "2", exact: true }).click();

  await expect(page).toHaveURL("/?page=2");
  await expect(page.getByText("title2", { exact: true })).toHaveCount(0);
  await expect(page.getByText("title1", { exact: true })).toBeVisible();
});
