import { describe, expect, it } from "vitest";

import {
  createFlashMessageCookieConfig,
  FlashMessageTypes,
  resolveFlashMessageContent,
} from "./index";

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
    "cookie.valueのkeyにtypeとmessageが存在し、かつ typeが%sの場合、typeとmessageが返る",
    (type) => {
      const cookieValue = JSON.stringify({
        type,
        message: "message",
      });
      const flashMessageContent = resolveFlashMessageContent({
        value: cookieValue,
      });
      expect(flashMessageContent).toEqual({
        type,
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
