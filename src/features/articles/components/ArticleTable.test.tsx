import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent, waitFor } from "@/testing/utils";

import { ArticleTable } from "./ArticleTable";

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

describe("ArticleTable", () => {
  it("記事の一覧が表示される", () => {
    render(<ArticleTable articles={articles} onDeleteAction={() => {}} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("First Article")).toBeInTheDocument();
    expect(screen.getByText("Second Article")).toBeInTheDocument();
  });

  it("削除ボタン押下時に確認モーダルが開き、承諾するとonDeleteActionに渡した関数が呼ばれる", async () => {
    const mockDeleteAction = vi.fn();
    render(
      <ArticleTable articles={articles} onDeleteAction={mockDeleteAction} />,
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
