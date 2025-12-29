import { consumeFlashMessageComposed } from "@/features/flashMessage/composition/consumeFlashMessageComposed";
import { render } from "@testing/utils";

import { FlashMessageNotifier } from ".";

vi.mock("@/features/flashMessage/composition/consumeFlashMessageComposed");
const mockedConsumeFlashMessageComposed = vi.mocked(
  consumeFlashMessageComposed,
);

describe("FlashMessageNotifier", () => {
  it("consumeFlashMessageを呼び出すこと", () => {
    render(<FlashMessageNotifier />);
    expect(mockedConsumeFlashMessageComposed).toHaveBeenCalled();
  });
});
