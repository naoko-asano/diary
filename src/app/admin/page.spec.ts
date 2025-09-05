import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin/articles");
});

test("記事タイトル一覧が表示されている", async ({ page }) => {
  await expect(page.getByText("foo")).toBeVisible();
  await expect(page.getByText("baz")).toBeVisible();
});

test("編集ボタンが表示されている", async ({ page }) => {
  const editingButtons = page.getByRole("button", {
    name: "Edit",
  });

  await expect(editingButtons.first()).toBeVisible();
  await expect(editingButtons).toHaveCount(2);
});
