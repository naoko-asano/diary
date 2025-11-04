import { expect, test } from "@playwright/test";

import { resetArticles } from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2025-01-01"));
  await page.goto("/admin/articles/new");
});

test.beforeAll(async () => {
  await resetArticles();
});

test("記事を作成できる", async ({ page }) => {
  const dateInput = page.getByLabel("Date *");
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await expect(dateInput).toHaveText("2025/01/01");
  await expect(titleInput).toHaveValue("");
  await expect(bodyInput).toHaveValue("");

  await dateInput.click();
  const calendar = page.getByRole("dialog");
  const dayButton = calendar.getByRole("button", {
    name: "2 January 2025",
    exact: true,
  });
  await dayButton.click();

  await expect(dateInput).toHaveText("2025/01/02");
  await titleInput.fill("New Title");
  await bodyInput.fill("New Body");
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/admin/articles");
  await expect(page.getByText("New Title")).toBeVisible();
  // テスト環境ではuseEffectが2回実行されるため、first()で対応
  await expect(
    page.getByText("Article created successfully!").first(),
  ).toBeVisible();
});

test("バリデーションに失敗する場合、エラーメッセージが表示され、記事は作成されない", async ({
  page,
}) => {
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await titleInput.fill(" ");
  await bodyInput.fill("New Body");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("1文字以上入力してください")).toBeVisible();
  await expect(page).toHaveURL("/admin/articles/new");
});
