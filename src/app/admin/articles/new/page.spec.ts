import { expect, test } from "@playwright/test";

import { resetArticles } from "$e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/articles/new");
});

test.beforeAll(async () => {
  await resetArticles();
});

test("記事を作成できる", async ({ page }) => {
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await expect(titleInput).toHaveValue("");
  await expect(bodyInput).toHaveValue("");

  await titleInput.fill("New Title");
  await bodyInput.fill("New Body");
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/admin/articles");
  await expect(page.getByText("New Title")).toBeVisible();
  // テスト環境ではレンダリングが2回起きてしまうため、first()で対応
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
