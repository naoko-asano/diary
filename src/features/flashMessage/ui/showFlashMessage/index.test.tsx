import { notifications } from "@mantine/notifications";

import { FlashMessageTypes } from "@/features/flashMessage/model";

import { showFlashMessage } from ".";

vi.mock("@mantine/notifications");
const mockedNotifications = vi.mocked(notifications);

describe("showFlashMessage", () => {
  it("notifications.showが呼び出される", () => {
    showFlashMessage({
      type: FlashMessageTypes.SUCCESS,
      message: "Test message",
    });
    expect(mockedNotifications.show).toHaveBeenCalled();
  });
});
