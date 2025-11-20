import { describe, it } from "vitest";

import { Status } from "@/features/articles/model";
import { render, screen } from "@testing/utils";

import { ArticleDetails } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  date: new Date("2025-01-01"),
  status: Status.PUBLISHED,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleDetails", () => {
  it("タイトルと日付、本文が正しく表示される", () => {
    render(<ArticleDetails article={article} />);
    screen.getByText("example title");
    screen.getByText("2025/01/01");
    screen.getByText("example body");
  });
});
