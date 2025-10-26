import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing/utils";

import { Pagination } from ".";

const mockedPush = vi.fn();
vi.mock("next/navigation", () => {
  return {
    usePathname: vi.fn(() => "/foo"),
    useRouter: vi.fn(() => ({
      push: mockedPush,
    })),
  };
});

describe("Pagination", () => {
  it("ページ変更時にクエリストリングが更新される", () => {
    render(<Pagination total={2} />);
    const page2Button = screen.getByRole("button", { name: "2" });
    page2Button.click();
    expect(mockedPush).toHaveBeenCalledWith("/foo?page=2");
  });
});
