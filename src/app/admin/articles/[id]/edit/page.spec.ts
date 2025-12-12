import path from "path";

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

  await page.goto(`/admin/articles/${latestArticleId}/edit`);
});

test("記事が更新できる", async ({ page }) => {
  const dateInput = page.getByLabel("Date *");
  await expect(dateInput).toHaveText("2025/01/01");
  await dateInput.click();
  const calendar = page.getByRole("dialog");
  const dayButton = calendar.getByRole("button", {
    name: "2 January 2025",
    exact: true,
  });
  await dayButton.click();

  const featuredImageButton = page.getByRole("button", {
    name: "Featured Image",
  });
  await featuredImageButton.click();
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.resolve("e2e/images/sample.jpg"));

  const titleInput = page.getByLabel("Title *");
  await expect(titleInput).toHaveValue("title1");
  await titleInput.fill("updated title");

  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");
  await expect(bodyInput).toHaveValue("body1");
  await bodyInput.fill("updated body");

  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL("/admin/articles");

  await expect(page.getByText("updated title")).toBeVisible();
  // テスト環境ではレンダリングが2回起きてしまうため、first()で対応
  await expect(
    page.getByText("Article updated successfully!").first(),
  ).toBeVisible();

  await page.goto("/");

  await expect(
    page.getByRole("img", { name: "updated title" }),
  ).toHaveAttribute("src", /sample/);
});

test("記事が存在しないidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/9999/edit");
  expect(response?.status()).toBe(404);
});

test("不正なidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/invalid/edit");
  expect(response?.status()).toBe(404);
});
