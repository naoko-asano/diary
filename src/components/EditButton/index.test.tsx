import { describe, expect, it } from "vitest";

import { render, screen } from "@testing/utils";

import { EditButton } from "./index";

describe("EditButton", () => {
  it("hrefで指定したURLに遷移するリンクが表示される", () => {
    render(<EditButton href="https://example.com/edit" />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "https://example.com/edit");
  });
});
