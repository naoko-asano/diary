import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent, waitFor } from "@/testing/utils";

import { ArticleList } from ".";

const articles = [
  {
    id: 1,
    title: "First Article",
    body: "This is the first article.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Second Article",
    body: "This is the second article.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("ArticleList", () => {
  it("記事の一覧が表示される", () => {
    render(<ArticleList articles={articles} onDeleteAction={() => {}} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("First Article")).toBeInTheDocument();
    expect(screen.getByText("Second Article")).toBeInTheDocument();
  });

  it("記事のタイトルのリンク先が記事の詳細ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={() => {}} />);
    const firstTitleLink = screen.getByRole("link", { name: "First Article" });
    const secondTitleLink = screen.getByRole("link", {
      name: "Second Article",
    });

    expect(firstTitleLink).toHaveAttribute("href", "/articles/1");
    expect(secondTitleLink).toHaveAttribute("href", "/articles/2");
  });

  it("編集ボタンのリンク先が記事の編集ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={() => {}} />);
    const editingLinks = screen.getAllByRole("link", { name: "Edit" });

    expect(editingLinks).toHaveLength(2);
    expect(editingLinks[0]).toHaveAttribute("href", "/admin/articles/1/edit");
    expect(editingLinks[1]).toHaveAttribute("href", "/admin/articles/2/edit");
  });

  it("削除ボタン押下時に確認モーダルが開き、承諾するとonDeleteActionに渡した関数が呼ばれる", async () => {
    const mockDeleteAction = vi.fn();
    render(
      <ArticleList articles={articles} onDeleteAction={mockDeleteAction} />,
    );
    const deletingButtons = screen.getAllByRole("button", { name: "Delete" });

    expect(deletingButtons).toHaveLength(2);

    await userEvent.click(deletingButtons[0]);

    await waitFor(() =>
      expect(
        screen.getByText("記事を削除します。よろしいですか？"),
      ).toBeVisible(),
    );

    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockDeleteAction).toHaveBeenCalledTimes(1);
    expect(mockDeleteAction).toHaveBeenCalledWith(1);
  });
});
