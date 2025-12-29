import {
  assertFlashMessage,
  createFlashMessageCookieConfig,
  FlashMessageTypes,
  parseFlashMessageCookie,
} from ".";

describe("assertFlashMessage", () => {
  it.each([FlashMessageTypes.SUCCESS, FlashMessageTypes.ERROR])(
    "typeとmessageが存在し、かつ typeが %s の場合、エラーが発生しない",
    (type) => {
      expect(() =>
        assertFlashMessage({ type, message: "message" }),
      ).not.toThrow();
    },
  );

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["string", "foo"],
    ["number", 123],
  ])("引数が %s 型の場合、エラーが発生する", (_, value) => {
    expect(() => assertFlashMessage(value)).toThrow("Invalid flash message");
  });

  it("typeまたはmessageが存在しない場合、エラーが発生する", () => {
    expect(() =>
      assertFlashMessage({ type: FlashMessageTypes.SUCCESS }),
    ).toThrow("Invalid flash message");
    expect(() => assertFlashMessage({ message: "message" })).toThrow(
      "Invalid flash message",
    );
  });

  it("typeがFlashMessageTypesでない場合、エラーが発生する", () => {
    expect(() =>
      assertFlashMessage({ type: "invalid", message: "message" }),
    ).toThrow("Invalid flash message");
  });
});

describe("createFlashMessageCookieConfig", () => {
  it.each([FlashMessageTypes.SUCCESS, FlashMessageTypes.ERROR])(
    "typeが %s の場合、typeとmessageがvalueにセットされて返る",
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
        maxAge: 30,
      });
    },
  );
});

describe("parseFlashMessageCookie", () => {
  it.each([FlashMessageTypes.SUCCESS, FlashMessageTypes.ERROR])(
    "cookie.valueをJSON.parseした結果がFlashMessage型である場合、FlashMessageが返る",
    (type) => {
      const cookieValue = JSON.stringify({
        type,
        message: "message",
      });
      const flashMessage = parseFlashMessageCookie({
        value: cookieValue,
      });
      expect(flashMessage).toEqual({
        type,
        message: "message",
      });
    },
  );

  it("cookieがundefinedの場合、nullが返る", () => {
    expect(parseFlashMessageCookie()).toBeNull();
  });

  it("cookie.valueがJSON.parseできない場合、nullが返る", () => {
    expect(parseFlashMessageCookie({ value: "foo" })).toBeNull();
  });

  it("cookie.valueをJSON.parseした結果がFlashMessage型でない場合、nullが返る", () => {
    const cookieValue = JSON.stringify({
      type: "invalid",
      message: "message",
    });
    expect(parseFlashMessageCookie({ value: cookieValue })).toBeNull();
  });
});
