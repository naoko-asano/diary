import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/testing/utils";

import { ConfirmationModal } from ".";

describe("ConfirmationModal", () => {
  it("titleとtextに指定した文字列が表示される", () => {
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onCancel={() => {}}
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
        onCancel={() => {}}
        body="sample body"
      />,
    );

    expect(screen.getByText("確認")).toBeVisible();
  });

  it("Acceptボタン押下でonAcceptが呼ばれる", async () => {
    const mockOnAccept = vi.fn();

    render(
      <ConfirmationModal
        isOpened={true}
        body="sample body"
        onAccept={mockOnAccept}
        onCancel={() => {}}
      />,
    );
    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it("x印クリックでonCancelが呼ばれる", async () => {
    const mockOnCancel = vi.fn();
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onCancel={mockOnCancel}
        body="sample body"
      />,
    );
    const closingButton = screen.getAllByRole("button")[0];
    await userEvent.click(closingButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
