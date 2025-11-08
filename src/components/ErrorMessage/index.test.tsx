import { describe, expect, it } from "vitest";

import { render, screen } from "@testing/utils";

import { ErrorMessage } from ".";

describe("ErrorMessage", () => {
  it("childrenで渡されたテキストを表示する", () => {
    render(<ErrorMessage>エラーが発生しています</ErrorMessage>);

    expect(screen.getByText("エラーが発生しています")).toBeInTheDocument();
  });
});
