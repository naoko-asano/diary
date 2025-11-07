import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent, waitFor, within } from "@testing/utils";

import { ArticleList } from ".";

const articles = [
  {
    id: 1,
    title: "First Article",
    body: "This is the first article.",
    date: new Date("2025-01-02"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Second Article",
    body: "This is the second article.",
    date: new Date("2025-01-01"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("ArticleList", () => {
  it("記事の一覧が表示される", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();

    const firstArticleRow = screen.getByRole("row", { name: /First Article/i });
    expect(firstArticleRow).toBeInTheDocument();
    expect(within(firstArticleRow).getByText("2025/01/02")).toBeInTheDocument();

    const secondArticleRow = screen.getByRole("row", {
      name: /Second Article/i,
    });
    expect(secondArticleRow).toBeInTheDocument();
    expect(
      within(secondArticleRow).getByText("2025/01/01"),
    ).toBeInTheDocument();
  });

  it("記事のタイトルのリンク先が記事の詳細ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    const firstTitleLink = screen.getByRole("link", { name: "First Article" });
    const secondTitleLink = screen.getByRole("link", {
      name: "Second Article",
    });

    expect(firstTitleLink).toHaveAttribute("href", "/articles/1");
    expect(secondTitleLink).toHaveAttribute("href", "/articles/2");
  });

  it("編集ボタンのリンク先が記事の編集ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    const editingLinks = screen.getAllByRole("link", { name: "Edit" });

    expect(editingLinks).toHaveLength(2);
    expect(editingLinks[0]).toHaveAttribute("href", "/admin/articles/1/edit");
    expect(editingLinks[1]).toHaveAttribute("href", "/admin/articles/2/edit");
  });

  it("削除ボタン押下時に確認モーダルが開き、承諾するとonDeleteActionに渡した関数が呼ばれ、フラッシュメッセージが表示される", async () => {
    const mockDeleteAction = vi.fn();
    render(
      <ArticleList articles={articles} onDeleteAction={mockDeleteAction} />,
    );
    const deletingButtons = screen.getAllByRole("button", { name: "Delete" });

    expect(deletingButtons).toHaveLength(2);

    await userEvent.click(deletingButtons[0]);

    await waitFor(() =>
      expect(
        screen.getByText(
          "記事を削除します。 この操作は元に戻せません。よろしいですか？",
        ),
      ).toBeVisible(),
    );

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockDeleteAction).toHaveBeenCalledTimes(1);
    expect(mockDeleteAction).toHaveBeenCalledWith(1);

    await waitFor(() =>
      expect(screen.getByText("Article deleted successfully!")).toBeVisible(),
    );
  });

  it("onDeleteActionでエラーが発生した場合、フラッシュメッセージでエラーが表示される", async () => {
    const mockDeleteAction = vi.fn().mockRejectedValue(new Error("Failed"));
    render(
      <ArticleList articles={articles} onDeleteAction={mockDeleteAction} />,
    );
    const deletingButtons = screen.getAllByRole("button", { name: "Delete" });
    await userEvent.click(deletingButtons[0]);

    await waitFor(() =>
      expect(
        screen.getByText(
          "記事を削除します。 この操作は元に戻せません。よろしいですか？",
        ),
      ).toBeVisible(),
    );
    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockDeleteAction).toHaveBeenCalledTimes(1);
    expect(mockDeleteAction).toHaveBeenCalledWith(1);

    await waitFor(() =>
      expect(
        screen.getByText("Failed to delete article. Please try again later."),
      ).toBeVisible(),
    );
  });
});
