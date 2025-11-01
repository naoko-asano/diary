import { describe, expect, it } from "vitest";

import { render, screen } from "@testing/utils";

import { ArticleCard } from ".";
const article = {
  id: 1,
  title: "example title",
  body: "example body",
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
});
