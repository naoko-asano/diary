import { test, expect } from "@playwright/test";

test("記事一覧が表示されている", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("foo")).toBeVisible();
  await expect(page.getByText("bar")).toBeVisible();

  await expect(page.getByText("baz")).toBeVisible();
  await expect(page.getByText("qux")).toBeVisible();
});
