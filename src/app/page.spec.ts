import { expect, test } from "@playwright/test";

import { Status } from "@/features/articles/model";
import {
  createArticle,
  resetArticles,
  seedArticles,
} from "@e2e/factories/article";

test.beforeEach(async () => {
  await resetArticles();
});

test("公開された記事のみが表示されている", async ({ page }) => {
  const articles = [
    {
      title: "title1",
      body: "body1",
      date: new Date("2025-01-01"),
      status: Status.PUBLISHED,
    },
    {
      title: "title2",
      body: "body2",
      date: new Date("2025-01-02"),
      status: Status.DRAFT,
    },
  ];
  for (const article of articles) {
    await createArticle(article);
  }
  await page.goto("/");

  await expect(page.getByText("title1")).toBeVisible();
  await expect(page.getByText("2025/01/01")).toBeVisible();

  await expect(page.getByText("title2")).toHaveCount(0);
  await expect(page.getByText("2025/01/02")).toHaveCount(0);
});

test("1ページにつき15記事が表示される", async ({ page }) => {
  await seedArticles(16);
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
