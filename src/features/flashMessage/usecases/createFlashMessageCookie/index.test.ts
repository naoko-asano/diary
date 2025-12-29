import {
  createFlashMessageCookieConfig,
  FlashMessageTypes,
} from "@/features/flashMessage/model";

import { createFlashMessageCookie } from ".";

describe("createFlashMessageCookie", () => {
  it("フラッシュメッセージ用のCookieが追加される", () => {
    const writer = {
      write: vi.fn(),
    };
    const flashMessage = {
      type: FlashMessageTypes.SUCCESS,
      message: "Test message",
    };
    const expectedConfig = createFlashMessageCookieConfig(flashMessage);

    createFlashMessageCookie(flashMessage, writer);

    expect(writer.write).toHaveBeenCalledWith(expectedConfig);
  });
});
