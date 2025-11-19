import { expect, test } from "@playwright/test";

import {
  fetchFirstArticleId,
  resetArticles,
  seedArticles,
} from "@e2e/factories/article";

test.beforeEach(async ({ page }) => {
  await resetArticles();
  await seedArticles(1);
  const firstArticleId = await fetchFirstArticleId();

  await page.goto(`/admin/articles/${firstArticleId}/edit`);
});

test("更新前の記事のタイトルと本文が表示され、記事が更新できる", async ({
  page,
}) => {
  const dateInput = page.getByLabel("Date *");
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await expect(dateInput).toHaveText("2025/01/01");
  await expect(titleInput).toHaveValue("title1");
  await expect(bodyInput).toHaveValue("body1");

  await dateInput.click();
  const calendar = page.getByRole("dialog");
  const dayButton = calendar.getByRole("button", {
    name: "2 January 2025",
    exact: true,
  });
  await dayButton.click();

  await expect(dateInput).toHaveText("2025/01/02");

  await titleInput.fill("updated title");
  await bodyInput.fill("updated body");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForURL("/admin/articles");

  await expect(page.getByText("updated title")).toBeVisible();
  // テスト環境ではレンダリングが2回起きてしまうため、first()で対応
  await expect(
    page.getByText("Article updated successfully!").first(),
  ).toBeVisible();
});

test("バリデーションに失敗する場合、エラーメッセージが表示され、記事は更新されない", async ({
  page,
}) => {
  // HINT: Webkitでは日付選択欄の初期化が完了しないと、他の値も初期値に差し戻ってしまう
  await expect(page.getByLabel("Date *")).toHaveText("2025/01/01");
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await titleInput.fill(" ");
  await bodyInput.fill("updated body");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("1文字以上入力してください")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/articles\/\d+\/edit/);
});

test("記事が存在しないidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/9999/edit");
  expect(response?.status()).toBe(404);
});

test("不正なidが指定された場合、404が返る", async ({ page }) => {
  const response = await page.goto("/admin/articles/invalid/edit");
  expect(response?.status()).toBe(404);
});
