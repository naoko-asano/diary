import { FlashMessageTypes } from "../../model";

import { fetchFlashMessage } from ".";

describe("fetchFlashMessage", () => {
  it("指定URLにリクエストし、jsonを返す", async () => {
    const flashMessage = {
      type: FlashMessageTypes.SUCCESS,
      message: "message",
    };
    const response = {
      ok: true,
      json: vi.fn().mockResolvedValue(flashMessage),
    };
    global.fetch = vi.fn().mockResolvedValue(response as unknown as Response);
    const result = await fetchFlashMessage();

    expect(global.fetch).toHaveBeenCalledWith("/api/flashMessage");
    expect(result).toEqual({
      type: FlashMessageTypes.SUCCESS,
      message: "message",
    });
  });

  it("fetchが失敗した場合、エラーをスローする", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchFlashMessage()).rejects.toThrow(
      "Failed to fetch flash message",
    );
  });
});
