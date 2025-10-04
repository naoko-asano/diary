import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/testing/utils";

import { ConfirmationModal } from ".";

describe("ConfirmationModal", () => {
  it("titleとtextに指定した文字列が表示される", () => {
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onClose={() => {}}
        title="sample title"
        body="sample body"
      />,
    );

    expect(screen.getByText("sample title")).toBeVisible();
    expect(screen.getByText("sample body")).toBeVisible();
  });
  it("titleを指定しない場合、デフォルトのタイトルが表示される", () => {
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onClose={() => {}}
        body="sample body"
      />,
    );

    expect(screen.getByText("確認")).toBeVisible();
  });

  it("Acceptボタン押下でonAcceptとonCloseが呼ばれる", async () => {
    const mockOnAccept = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <ConfirmationModal
        isOpened={true}
        body="sample body"
        onAccept={mockOnAccept}
        onClose={mockOnClose}
      />,
    );
    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("x印クリックでonCloseが呼ばれる", async () => {
    const mockonClose = vi.fn();
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onClose={mockonClose}
        body="sample body"
      />,
    );
    const closingButton = screen.getAllByRole("button")[0];
    await userEvent.click(closingButton);

    expect(mockonClose).toHaveBeenCalledTimes(1);
  });
});
