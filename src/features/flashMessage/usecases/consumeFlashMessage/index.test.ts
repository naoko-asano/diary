import { consumeFlashMessage } from ".";

describe("consumeFlashMessage", () => {
  it("fetchContentの戻り値が存在する場合、showを呼び出す", async () => {
    const content = { type: "success", message: "Test message" };
    const fetchContent = vi.fn().mockResolvedValue(content);
    const show = vi.fn();

    await consumeFlashMessage({
      fetchContent,
      show,
    });

    expect(fetchContent).toHaveBeenCalled();
    expect(show).toHaveBeenCalledWith(content);
  });

  it("fetchContentの戻り値がnullの場合、showを呼び出さない", async () => {
    const fetchContent = vi.fn().mockResolvedValue(null);
    const show = vi.fn();

    await consumeFlashMessage({
      fetchContent,
      show,
    });

    expect(fetchContent).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });

  it("内部でエラーが起きても、エラーをスローしない", async () => {
    const fetchContent = vi.fn().mockRejectedValue(new Error("Fetch error"));
    const show = vi.fn();

    await expect(
      consumeFlashMessage({
        fetchContent,
        show,
      }),
    ).resolves.not.toThrow();

    expect(fetchContent).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });
});
