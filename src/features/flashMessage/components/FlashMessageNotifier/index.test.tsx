import { notifications } from "@mantine/notifications";

import { consumeFlashMessage } from "@/features/flashMessage/model/consumeFlashMessage";
import { render } from "@testing/utils";

import { FlashMessageNotifier } from ".";

beforeEach(() => {
  notifications.clean();
});

vi.mock("@/features/flashMessage/model/consumeFlashMessage");
const mockedConsumeFlashMessage = vi.mocked(consumeFlashMessage);

describe("FlashMessageNotifier", () => {
  it("consumeFlashMessageを呼び出すこと", () => {
    render(<FlashMessageNotifier />);
    expect(mockedConsumeFlashMessage).toHaveBeenCalled();
  });
});
