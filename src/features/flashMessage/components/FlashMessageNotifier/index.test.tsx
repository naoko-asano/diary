import { render } from "@testing/utils";

import { consumeFlashMessageComposed } from "../../composition/consumeFlashMessageComposed";

import { FlashMessageNotifier } from ".";

vi.mock("../../composition/consumeFlashMessageComposed");
const mockedConsumeFlashMessageComposed = vi.mocked(
  consumeFlashMessageComposed,
);

describe("FlashMessageNotifier", () => {
  it("consumeFlashMessageを呼び出すこと", () => {
    render(<FlashMessageNotifier />);
    expect(mockedConsumeFlashMessageComposed).toHaveBeenCalled();
  });
});
