import { notifications } from "@mantine/notifications";
import { beforeEach, describe, expect, it } from "vitest";

import { act, render, screen } from "@/testing/utils";
import { FormResult } from "@/utils/formState";

import {
  createFlashMessageCookieConfig,
  resolveFlashMessageContent,
  showFlashMessage,
} from "./index";

beforeEach(() => {
  notifications.clean();
});

describe("showFlashMessage", () => {
  it("formState.resultがsuccessの場合、Successと渡されたmessageがメッセージが表示される", async () => {
    render(<></>);
    await act(async () => {
      showFlashMessage({
        formState: { result: "success" },
        message: "message",
      });
    });

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });

  it("formState.resultがerrorの場合、Errorと渡されたmessageが表示される", async () => {
    render(<></>);
    await act(async () => {
      showFlashMessage({
        formState: { result: "error" },
        message: "message",
      });
    });

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("message")).toBeInTheDocument();
  });

  it("formState.resultがnullの場合、何も表示されない", async () => {
    render(<></>);
    await act(async () => {
      showFlashMessage({
        formState: { result: null },
        message: "message",
      });
    });

    expect(screen.queryByText("Success")).not.toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
    expect(screen.queryByText("message")).not.toBeInTheDocument();
  });
});

describe("createFlashMessageCookieConfig", () => {
  it.each([FormResult.SUCCESS, FormResult.ERROR])(
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
    expect(() => resolveFlashMessageContent({ value: cookieValue })).toThrow(
      "Cookie is not for flash Message",
    );
  });

  it("cookie.valueのkeyにmessageが存在しない場合、エラーが発生する", () => {
    const cookieValue = JSON.stringify({
      type: "success",
    });
    expect(() => resolveFlashMessageContent({ value: cookieValue })).toThrow(
      "Cookie is not for flash Message",
    );
  });

  it("cookie.valueがJSON.parseできない場合、エラーが発生する", () => {
    expect(() => resolveFlashMessageContent({ value: "foo" })).toThrow();
  });
});
