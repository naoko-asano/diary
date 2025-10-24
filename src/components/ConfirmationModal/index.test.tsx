import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@testing/utils";

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
    const mockedOnAccept = vi.fn();
    const mockedOnClose = vi.fn();

    render(
      <ConfirmationModal
        isOpened={true}
        body="sample body"
        onAccept={mockedOnAccept}
        onClose={mockedOnClose}
      />,
    );
    const acceptButton = screen.getByRole("button", { name: "Accept" });
    await userEvent.click(acceptButton);

    expect(mockedOnAccept).toHaveBeenCalledTimes(1);
    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });

  it("x印クリックでonCloseが呼ばれる", async () => {
    const mockedOnClose = vi.fn();
    render(
      <ConfirmationModal
        isOpened={true}
        onAccept={() => {}}
        onClose={mockedOnClose}
        body="sample body"
      />,
    );
    const closingButton = screen.getAllByRole("button")[0];
    await userEvent.click(closingButton);

    expect(mockedOnClose).toHaveBeenCalledTimes(1);
  });
});
