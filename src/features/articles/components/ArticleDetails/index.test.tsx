import { describe, it } from "vitest";

import { render, screen } from "@testing/utils";

import { ArticleDetails } from ".";

const article = {
  id: 1,
  title: "example title",
  body: "example body",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ArticleDetails", () => {
  it("titleとbodyが正しく表示される", () => {
    render(<ArticleDetails article={article} />);
    screen.getByText("example title");
    screen.getByText("example body");
  });
});
