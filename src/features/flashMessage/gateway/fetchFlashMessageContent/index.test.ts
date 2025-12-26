import { fetchFlashMessageContent } from ".";

describe("fetchFlashMessageContent", () => {
  it("指定URLにリクエストし、jsonを返す", async () => {
    const mockedJson = { type: "success", message: "message" };
    const mockedResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockedJson),
    };
    global.fetch = vi
      .fn()
      .mockResolvedValue(mockedResponse as unknown as Response);

    const result = await fetchFlashMessageContent();

    expect(global.fetch).toHaveBeenCalledWith("/api/flashMessageContent");
    expect(result).toEqual({ type: "success", message: "message" });
  });

  it("fetchが失敗した場合、エラーをスローする", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchFlashMessageContent()).rejects.toThrow(
      "Failed to fetch flash message content",
    );
  });
});
