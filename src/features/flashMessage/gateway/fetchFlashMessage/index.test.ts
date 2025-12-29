import { fetchFlashMessage } from ".";

describe("fetchFlashMessage", () => {
  it("指定URLにリクエストし、jsonを返す", async () => {
    const flashMessage = { type: "success", message: "message" };
    const response = {
      ok: true,
      json: vi.fn().mockResolvedValue(flashMessage),
    };
    global.fetch = vi.fn().mockResolvedValue(response as unknown as Response);
    const result = await fetchFlashMessage();

    expect(global.fetch).toHaveBeenCalledWith("/api/flashMessageContent");
    expect(result).toEqual({ type: "success", message: "message" });
  });

  it("fetchが失敗した場合、エラーをスローする", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchFlashMessage()).rejects.toThrow(
      "Failed to fetch flash message content",
    );
  });
});
