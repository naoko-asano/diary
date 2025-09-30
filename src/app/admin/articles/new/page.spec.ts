import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/articles/new");
});

test("記事を作成できる", async ({ page }) => {
  await page.getByLabel("Title *").fill("新しい記事");
  await page.getByTestId("body-editor").getByRole("textbox").fill("内容");
  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/admin/articles");
  await expect(page.getByText("新しい記事")).toBeVisible();
});
