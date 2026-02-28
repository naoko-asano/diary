import { describe, expect, it, vi } from "vitest";

import { STATUSES as ArticleStatuses } from "@/features/articles/model";
import { render, screen, userEvent, waitFor, within } from "@testing/utils";

import { ArticleList } from ".";

const firstArticle = {
  id: 1,
  title: "First Article",
  body: "This is the first article.",
  featuredImageUrl: null,
  date: new Date("2025-01-02"),
  status: ArticleStatuses.DRAFT,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const secondArticle = {
  id: 2,
  title: "Second Article",
  body: "This is the second article.",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: ArticleStatuses.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const baseArticles = [firstArticle, secondArticle];
const baseDeleteAction = vi.fn();

describe("記事一覧コンポーネント", () => {
  it("リストの見出しが表示される", () => {
    render(
      <ArticleList
        articles={[...baseArticles]}
        deleteAction={baseDeleteAction}
      />,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("記事のタイトル、日付、ステータス、編集リンク、削除ボタンが表示される", () => {
    render(
      <ArticleList
        articles={[...baseArticles]}
        deleteAction={baseDeleteAction}
      />,
    );

    const firstArticleRow = screen.getByRole("row", { name: /First Article/i });
    const secondArticleRow = screen.getByRole("row", {
      name: /Second Article/i,
    });

    expect(within(firstArticleRow).getByText("2025/01/02")).toBeInTheDocument();
    expect(within(firstArticleRow).getByText("Draft")).toBeInTheDocument();
    expect(
      within(firstArticleRow).getByRole("link", { name: "Edit Article" }),
    ).toBeInTheDocument();
    expect(
      within(firstArticleRow).getByRole("button", { name: "Delete Article" }),
    ).toBeInTheDocument();
    expect(
      within(secondArticleRow).getByText("2025/01/01"),
    ).toBeInTheDocument();
    expect(within(secondArticleRow).getByText("Published")).toBeInTheDocument();
    expect(
      within(secondArticleRow).getByRole("link", { name: "Edit Article" }),
    ).toBeInTheDocument();
    expect(
      within(secondArticleRow).getByRole("button", { name: "Delete Article" }),
    ).toBeInTheDocument();
  });

  it("記事のタイトルのリンク先が記事の詳細ページである", () => {
    render(
      <ArticleList
        articles={[...baseArticles]}
        deleteAction={baseDeleteAction}
      />,
    );

    const firstTitleLink = screen.getByRole("link", { name: "First Article" });
    const secondTitleLink = screen.getByRole("link", {
      name: "Second Article",
    });

    expect(firstTitleLink).toHaveAttribute("href", "/admin/articles/1");
    expect(secondTitleLink).toHaveAttribute("href", "/admin/articles/2");
  });

  it("編集リンクのリンク先が記事の編集ページである", () => {
    render(
      <ArticleList
        articles={[...baseArticles]}
        deleteAction={baseDeleteAction}
      />,
    );

    const editLinks = screen.getAllByRole("link", { name: "Edit Article" });
    expect(editLinks[0]).toHaveAttribute("href", "/admin/articles/1/edit");
    expect(editLinks[1]).toHaveAttribute("href", "/admin/articles/2/edit");
  });

  describe("削除ボタンを押下した場合", () => {
    it("表示された確認メッセージを承諾すると、削除アクションが実行され、成功メッセージが表示される", async () => {
      const deleteAction = baseDeleteAction;
      render(
        <ArticleList
          articles={[
            { ...firstArticle, id: 11 },
            { ...secondArticle, id: 12 },
          ]}
          deleteAction={deleteAction}
        />,
      );

      const deleteButton = screen.getAllByRole("button", {
        name: "Delete Article",
      })[0];
      await userEvent.click(deleteButton);

      await waitFor(() =>
        expect(
          screen.getByText(
            "記事を削除します。 この操作は元に戻せません。よろしいですか？",
          ),
        ).toBeVisible(),
      );

      const acceptButton = screen.getByRole("button", { name: "Accept" });
      await userEvent.click(acceptButton);

      expect(deleteAction).toHaveBeenCalledTimes(1);
      expect(deleteAction).toHaveBeenCalledWith(11);
      await waitFor(() =>
        expect(
          screen.getByText("Article deleted successfully!"),
        ).toBeInTheDocument(),
      );
    });

    it("削除アクションでエラーが発生した場合、エラーメッセージが表示される", async () => {
      const deleteAction = vi.fn().mockRejectedValue(new Error("Failed"));

      render(
        <ArticleList
          articles={[
            { ...firstArticle, id: 11 },
            { ...secondArticle, id: 12 },
          ]}
          deleteAction={deleteAction}
        />,
      );

      const deleteButton = screen.getAllByRole("button", {
        name: "Delete Article",
      })[0];
      await userEvent.click(deleteButton);
      const acceptButton = screen.getByRole("button", { name: "Accept" });
      await userEvent.click(acceptButton);

      await waitFor(() =>
        expect(
          screen.getByText("Failed to delete article. Please try again later."),
        ).toBeInTheDocument(),
      );
    });
  });
});
