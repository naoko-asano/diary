import { describe, expect, it } from "vitest";

import { Status } from "@/features/articles/model";
import { render, screen } from "@testing/utils";

import { ArticleCard } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  date: new Date("2025-01-01"),
  status: Status.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleCard", () => {
  it("タイトルが正しく表示される", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("example title")).toBeVisible();
  });

  it("タイトルのリンク先が記事の詳細ページになっている", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/articles/1");
  });

  it("日付が正しく表示される", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByText("2025/01/01")).toBeVisible();
  });
});
