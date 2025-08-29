import { expect, test } from "@playwright/test";

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("foo")).toBeVisible();
  await expect(page.getByText("baz")).toBeVisible();
});
