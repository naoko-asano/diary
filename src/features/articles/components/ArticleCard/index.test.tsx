import { describe, expect, it } from "vitest";

import { Statuses as ArticleStatuses } from "@/features/articles/model";
import { render, screen } from "@testing/utils";

import { ArticleCard } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  featuredImageUrl: "/image.jpg",
  date: new Date("2025-01-01"),
  status: ArticleStatuses.PUBLISHED,
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

  it("アイキャッチ画像が表示される", () => {
    render(<ArticleCard article={article} />);
    expect(screen.getByRole("img", { name: /example title/i })).toHaveAttribute(
      "src",
      expect.stringContaining("image.jpg"),
    );
  });

  it("imagePropsでloading属性を指定できる", () => {
    render(<ArticleCard article={article} imageProps={{ loading: "eager" }} />);
    expect(screen.getByRole("img", { name: /example title/i })).toHaveAttribute(
      "loading",
      "eager",
    );
  });
});
