import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/testing/utils";

import { FlashMessageNotifier } from ".";

describe("FlashMessageNotifier", () => {
  it("'Success'とbodyで渡されたメッセージが表示される", () => {
    render(<FlashMessageNotifier type="success" message="message" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});
