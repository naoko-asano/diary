import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { act, render, screen } from "@testing/utils";

import {
  createFlashMessageCookieConfig,
  FlashMessageTypes,
  resolveFlashMessageContent,
  showFlashMessage,
} from "./index";

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

describe("createFlashMessageCookieConfig", () => {
  it.each([FlashMessageTypes.SUCCESS, FlashMessageTypes.ERROR])(
    "typeとmessageで渡された値がvalueにセットされて返る",
    (type) => {
      const config = createFlashMessageCookieConfig({
        type,
        message: "message",
      });
      expect(config).toEqual({
        name: "flash-message",
        value: JSON.stringify({
          type,
          message: "message",
        }),
        httpOnly: false,
        maxAge: 1,
      });
    },
  );
});

describe("resolveFlashMessageContent", () => {
  it.each(["success", "error"])(
    "cookie.valueのkeyにtypeとmessageが存在し、かつ typeが%sの場合、formStateとmessageが返る",
    (type) => {
      const cookieValue = JSON.stringify({
        type,
        message: "message",
      });
      const flashMessageContent = resolveFlashMessageContent({
        value: cookieValue,
      });
      expect(flashMessageContent).toEqual({
        formState: {
          result: type,
        },
        message: "message",
      });
    },
  );

  it("cookieがundefinedの場合、nullが返る", () => {
    expect(resolveFlashMessageContent()).toBeNull();
  });

  it("cookie.valueのkeyにtypeが存在しない場合、エラーが発生する", () => {
    const cookieValue = JSON.stringify({
      message: "message",
    });
    expect(resolveFlashMessageContent({ value: cookieValue })).toBeNull();
  });

  it("cookie.valueのkeyにmessageが存在しない場合、エラーが発生する", () => {
    const cookieValue = JSON.stringify({
      type: "success",
    });
    expect(resolveFlashMessageContent({ value: cookieValue })).toBeNull();
  });

  it("cookie.valueがJSON.parseできない場合、エラーが発生する", () => {
    expect(resolveFlashMessageContent({ value: "foo" })).toBeNull();
  });
});
