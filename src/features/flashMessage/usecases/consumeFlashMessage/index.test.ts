import { consumeFlashMessage } from ".";

describe("consumeFlashMessage", () => {
  it("fetchContentの戻り値が存在する場合、showを呼び出す", async () => {
    const flashMessage = { type: "success", message: "Test message" };
    const fetchFlashMessage = vi.fn().mockResolvedValue(flashMessage);
    const show = vi.fn();

    await consumeFlashMessage(
      {
        fetch: fetchFlashMessage,
      },
      {
        show,
      },
    );

    expect(fetchFlashMessage).toHaveBeenCalled();
    expect(show).toHaveBeenCalledWith(flashMessage);
  });

  it("fetchContentの戻り値がnullの場合、showを呼び出さない", async () => {
    const fetchFlashMessage = vi.fn().mockResolvedValue(null);
    const show = vi.fn();

    await consumeFlashMessage(
      {
        fetch: fetchFlashMessage,
      },
      {
        show,
      },
    );

    expect(fetchFlashMessage).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });

  it("内部でエラーが起きても、エラーをスローしない", async () => {
    const fetchFlashMessage = vi
      .fn()
      .mockRejectedValue(new Error("Fetch error"));
    const show = vi.fn();

    await expect(
      consumeFlashMessage(
        {
          fetch: fetchFlashMessage,
        },
        {
          show,
        },
      ),
    ).resolves.not.toThrow();

    expect(fetchFlashMessage).toHaveBeenCalled();
    expect(show).not.toHaveBeenCalled();
  });
});
