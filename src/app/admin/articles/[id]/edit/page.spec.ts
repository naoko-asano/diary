import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "$e2e/factories/article";
import prisma from "@/lib/database";

test.beforeEach(async ({ page }) => {
  await resetArticles();
  await seedArticles();
  const firstArticle = await prisma.article.findFirst();
  await page.goto(`/admin/articles/${firstArticle?.id}/edit`);
});

test("更新前の記事のタイトルと本文が表示され、記事が更新できる", async ({
  page,
}) => {
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await expect(titleInput).toHaveValue("title1");
  await expect(bodyInput).toHaveValue("body1");

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
  const titleInput = page.getByLabel("Title *");
  const bodyEditor = page.getByTestId("body-editor");
  const bodyInput = bodyEditor.getByRole("textbox");

  await titleInput.fill(" ");
  await bodyInput.fill("updated body");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("1文字以上入力してください")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/articles\/\d+\/edit/);
});

test("記事が見つからない場合、404ページが表示される", async ({ page }) => {
  await page.goto("/admin/articles/9999/edit");
  await expect(page.getByText("Not Found")).toBeVisible();
});
