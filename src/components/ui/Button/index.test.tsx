import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./index";

test("Button", () => {
  render(<Button />);
  expect(screen.getByRole("button")).toHaveTextContent("ボタン");
});
