import { describe, expect, it } from "vitest";

import { Status } from "@/features/articles/model";
import { render, screen } from "@testing/utils";

import { ArticleDetails } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  featuredImageUrl: null,
  date: new Date("2025-01-01"),
  status: Status.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleDetails", () => {
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
    render(<ArticleDetails article={article} />);
    expect(screen.queryByRole("img")).toBeNull();
  });
});
