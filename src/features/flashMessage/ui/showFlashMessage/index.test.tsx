import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { FlashMessageTypes } from "@/features/flashMessage/model";
import { act, render, screen } from "@testing/utils";

import { showFlashMessage } from ".";

beforeEach(() => {
  notifications.clean();
});

describe("showFlashMessage", () => {
  it("typeがsuccessの場合、Successと渡されたmessageがメッセージが表示される", async () => {
    render(<></>);
    await act(async () => {
      showFlashMessage({
        type: FlashMessageTypes.SUCCESS,
        message: "message",
      });
    });

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });

  it("typeがerrorの場合、Errorと渡されたmessageが表示される", async () => {
    render(<></>);
    await act(async () => {
      showFlashMessage({
        type: FlashMessageTypes.ERROR,
        message: "message",
      });
    });

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });
});
