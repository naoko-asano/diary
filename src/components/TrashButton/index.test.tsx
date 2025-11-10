import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing/utils";

import { TrashButton } from ".";

describe("TrashButton", () => {
  it("クリックすると、onClickが呼ばれる", () => {
    const handleClick = vi.fn();

    render(<TrashButton onClick={handleClick} />);
    screen.getByRole("button").click();

    expect(handleClick).toHaveBeenCalled();
  });
});
