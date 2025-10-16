import { expect, test } from "@playwright/test";

import { resetArticles, seedArticles } from "$e2e/factories/article";
import prisma from "@/lib/database";

test.beforeEach(async ({ page }) => {
  const firstArticle = await prisma.article.findFirst();
  await page.goto(`/admin/articles/${firstArticle?.id}/edit`);
});

test.beforeAll(async () => {
  await resetArticles();
  await seedArticles();
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
