import { describe, expect, it, vi } from "vitest";

import { createUser, render, screen } from "@testing/utils";

import { PlusButton } from "./index";

describe("PlusButton", () => {
  describe("roleに渡されたのがbuttonの場合", () => {
    it("クリックすると、onClickで渡された関数が実行される", async () => {
      const handleClick = vi.fn();
      const user = createUser();

      render(<PlusButton onClick={handleClick} />);
      const plusButton = screen.getByRole("button");
      await user.click(plusButton);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("roleに渡されたのがlinkの場合", () => {
    it("href属性が正しく設定されている", () => {
      render(<PlusButton role="link" href="/test" />);
      const plusButtonLink = screen.getByRole("link");

      expect(plusButtonLink).toHaveAttribute("href", "/test");
    });
  });
});
