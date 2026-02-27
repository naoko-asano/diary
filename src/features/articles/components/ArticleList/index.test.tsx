import { describe, expect, it, vi } from "vitest";

import { STATUSES as ArticleStatuses } from "@/features/articles/model";
import { FlashMessageTypes } from "@/features/flashMessage/model";
import { showFlashMessage } from "@/features/flashMessage/ui/showFlashMessage";
import { render, screen, userEvent, waitFor, within } from "@testing/utils";

import { ArticleList } from ".";
vi.mock("@/features/flashMessage/ui/showFlashMessage");
const mockedShowFlashMessage = vi.mocked(showFlashMessage);

const articles = [
  {
    id: 1,
    title: "First Article",
    body: "This is the first article.",
    featuredImageUrl: null,
    date: new Date("2025-01-02"),
    status: ArticleStatuses.DRAFT,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Second Article",
    body: "This is the second article.",
    featuredImageUrl: null,
    date: new Date("2025-01-01"),
    status: ArticleStatuses.PUBLISHED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("ArticleList", () => {
  it("記事の一覧が表示される", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    const firstArticleRow = screen.getByRole("row", { name: /First Article/i });
    expect(firstArticleRow).toBeInTheDocument();
    expect(within(firstArticleRow).getByText("2025/01/02")).toBeInTheDocument();
    expect(within(firstArticleRow).getByText("Draft")).toBeInTheDocument();

    const secondArticleRow = screen.getByRole("row", {
      name: /Second Article/i,
    });
    expect(secondArticleRow).toBeInTheDocument();
    expect(
      within(secondArticleRow).getByText("2025/01/01"),
    ).toBeInTheDocument();
    expect(within(secondArticleRow).getByText("Published")).toBeInTheDocument();
  });

  it("記事のタイトルのリンク先が記事の詳細ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    const firstTitleLink = screen.getByRole("link", { name: "First Article" });
    const secondTitleLink = screen.getByRole("link", {
      name: "Second Article",
    });

    expect(firstTitleLink).toHaveAttribute("href", "/admin/articles/1");
    expect(secondTitleLink).toHaveAttribute("href", "/admin/articles/2");
  });

  it("編集ボタンのリンク先が記事の編集ページである", () => {
    render(<ArticleList articles={articles} onDeleteAction={async () => {}} />);
    const editLinks = screen.getAllByRole("link", { name: "Edit Article" });

    expect(editLinks).toHaveLength(2);
    expect(editLinks[0]).toHaveAttribute("href", "/admin/articles/1/edit");
    expect(editLinks[1]).toHaveAttribute("href", "/admin/articles/2/edit");
  });

  it("削除ボタン押下時に確認モーダルが開き、承諾するとonDeleteActionに渡した関数が呼ばれ、showFlashMessageが呼ばれる", async () => {
    const mockDeleteAction = vi.fn();
    render(
      <ArticleList articles={articles} onDeleteAction={mockDeleteAction} />,
    );
    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Article",
    });

    expect(deleteButtons).toHaveLength(2);

    await userEvent.click(deleteButtons[0]);

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
      expect(mockedShowFlashMessage).toHaveBeenCalledWith({
        type: FlashMessageTypes.SUCCESS,
        message: "Article deleted successfully!",
      }),
    );
  });

  it("onDeleteActionでエラーが発生した場合、showFlashMessageが呼ばれる", async () => {
    const mockDeleteAction = vi.fn().mockRejectedValue(new Error("Failed"));
    render(
      <ArticleList articles={articles} onDeleteAction={mockDeleteAction} />,
    );
    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete Article",
    });
    await userEvent.click(deleteButtons[0]);

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
      expect(mockedShowFlashMessage).toHaveBeenCalledWith({
        type: FlashMessageTypes.ERROR,
        message: "Failed to delete article.\nPlease try again later.",
      }),
    );
  });
});
