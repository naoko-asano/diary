import { popNotification } from "@/features/notifications";
import { NOTIFICATION_TYPES } from "@/features/notifications/model";
import { showNotification } from "@/features/notifications/presenter/showNotification";
import { render, waitFor } from "@testing/utils";

import { StoredNotificationDisplay } from ".";

vi.mock("@/features/notifications");
const mockedPopNotification = vi.mocked(popNotification);
vi.mock("@/features/notifications/presenter/showNotification");
const mockedShowNotification = vi.mocked(showNotification);

it("通知の取得と表示が行われる", async () => {
  const notification = {
    type: NOTIFICATION_TYPES.SUCCESS,
    message: "Stored notification message",
  };
  mockedPopNotification.mockResolvedValue(notification);

  render(<StoredNotificationDisplay />);

  await waitFor(() => {
    expect(mockedPopNotification).toHaveBeenCalledTimes(1);
    expect(mockedShowNotification).toHaveBeenCalledTimes(1);
    expect(mockedShowNotification).toHaveBeenCalledWith(notification);
  });
});

it("通知が取得できない場合、表示されない", async () => {
  mockedPopNotification.mockResolvedValue(null);

  render(<StoredNotificationDisplay />);

  await waitFor(() => {
    expect(mockedPopNotification).toHaveBeenCalledTimes(1);
    expect(mockedShowNotification).not.toHaveBeenCalled();
  });
});
