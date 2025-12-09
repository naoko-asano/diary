import path from "path";

import { expect, test } from "@playwright/test";

import { resetArticles } from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2025-01-01"));
  await page.goto("/admin/articles/new");
});

test.beforeAll(async () => {
  await resetArticles();
});

test("アイキャッチ画像をアップロードし、記事を作成できる", async ({ page }) => {
  const statusSelector = page.getByLabel("Status");
  await statusSelector.selectOption({ label: "Publish" });

  const dateInput = page.getByLabel("Date *");
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
  await titleInput.fill("New Title");

  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");
  await bodyInput.fill("New Body");

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/admin/articles");

  await expect(page.getByText("New Title")).toBeVisible();
  await expect(page.getByText("Published")).toBeVisible();
  // テスト環境ではuseEffectが2回実行されるため、first()で対応
  await expect(
    page.getByText("Article created successfully!").first(),
  ).toBeVisible();

  await page.goto("/");

  await expect(page.getByRole("img", { name: "New Title" })).toHaveAttribute(
    "src",
    /sample/,
  );
});
