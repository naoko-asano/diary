import { describe, expect, it } from "vitest";

import { render, screen } from "@testing/utils";

import { BackButton } from ".";

describe("BackButton", () => {
  it("Backというテキストが表示される", () => {
    render(<BackButton href="/previous-page" />);
    expect(screen.getByRole("link")).toHaveTextContent("Back");
  });

  it("href属性が正しく設定されている", () => {
    render(<BackButton href="/previous-page">Go Back</BackButton>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/previous-page");
  });
});
