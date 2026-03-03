import { describe, expect, it } from "vitest";

import { STATUSES as ArticleStatuses } from "@/features/articles/model";
import { render, screen, within } from "@testing/utils";

import { ArticleDetails } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: ArticleStatuses.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("記事詳細コンポーネント", () => {
  it("タイトルと日付、本文が正しく表示される", () => {
    render(<ArticleDetails article={article} />);
    expect(screen.getByText("example title")).toBeInTheDocument();
    expect(screen.getByText("2025/01/01")).toBeInTheDocument();
    expect(screen.getByText("example body")).toBeInTheDocument();
  });

  it("アイキャッチ画像が設定されている場合、画像が表示される", () => {
    const articleWithImage = {
      ...article,
      featuredImageUrl: "/image.jpg",
    };
    render(<ArticleDetails article={articleWithImage} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", expect.stringContaining("image.jpg"));
  });

  it("アイキャッチ画像が設定されていない場合、画像が表示されない", () => {
    const articleWithoutImage = {
      ...article,
      featuredImageUrl: null,
    };
    render(<ArticleDetails article={articleWithoutImage} />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("Markdown形式の本文が正しく表示される", () => {
    const articleWithMarkdown = {
      ...article,
      body: "# Heading\n\n- list item",
    };
    render(<ArticleDetails article={articleWithMarkdown} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Heading" }),
    ).toBeInTheDocument();
    within(screen.getByRole("listitem")).getByText("list item");
  });
});
