import { consumeFlashMessage } from ".";

describe("consumeFlashMessage", () => {
  it("fetchContentの戻り値が存在する場合、showを呼び出す", async () => {
    const mockedContent = { type: "success", message: "Test message" };
    const mockedFetchContent = vi.fn().mockResolvedValue(mockedContent);
    const mockedShow = vi.fn();

    await consumeFlashMessage({
      fetchContent: mockedFetchContent,
      show: mockedShow,
    });

    expect(mockedFetchContent).toHaveBeenCalled();
    expect(mockedShow).toHaveBeenCalledWith(mockedContent);
  });

  it("fetchContentの戻り値がnullの場合、showを呼び出さない", async () => {
    const mockedFetchContent = vi.fn().mockResolvedValue(null);
    const mockedShow = vi.fn();

    await consumeFlashMessage({
      fetchContent: mockedFetchContent,
      show: mockedShow,
    });

    expect(mockedFetchContent).toHaveBeenCalled();
    expect(mockedShow).not.toHaveBeenCalled();
  });

  it("内部でエラーが起きても、エラーをスローしない", async () => {
    const mockedFetchContent = vi
      .fn()
      .mockRejectedValue(new Error("Fetch error"));
    const mockedShow = vi.fn();

    await expect(
      consumeFlashMessage({
        fetchContent: mockedFetchContent,
        show: mockedShow,
      }),
    ).resolves.not.toThrow();

    expect(mockedFetchContent).toHaveBeenCalled();
    expect(mockedShow).not.toHaveBeenCalled();
  });
});
