import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/testing/utils";

import { ArticleTable } from "./ArticleTable";

const articles = [
  { id: 1, title: "First Article" },
  { id: 2, title: "Second Article" },
];

describe("ArticleTable", () => {
  it("記事の一覧が表示される", () => {
    render(<ArticleTable articles={articles} onDeleteAction={() => {}} />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("First Article")).toBeInTheDocument();
    expect(screen.getByText("Second Article")).toBeInTheDocument();
  });

  it("deleteボタン押下時にonDeleteActionが呼ばれる", async () => {
    const mockDeleteAction = vi.fn();
    render(
      <ArticleTable articles={articles} onDeleteAction={mockDeleteAction} />,
    );

    const deletingButtons = screen.getAllByRole("button", { name: "Delete" });
    expect(deletingButtons).toHaveLength(2);

    await userEvent.click(deletingButtons[0]);
    expect(mockDeleteAction).toHaveBeenCalledTimes(1);
    expect(mockDeleteAction).toHaveBeenCalledWith(1);
  });
});
