import { ActionResultStatuses } from "@/features/actionResult/model";
import { showNotification } from "@/features/notifications/presenter/showNotification";
import { renderHook, waitFor } from "@testing/utils";

import { useActionResultNotifier } from ".";

vi.mock("@/features/notifications/presenter/showNotification");
const mockedShowNotification = vi.mocked(showNotification);

it("アクション結果が成功の場合、メッセージが表示されること", async () => {
  const actionResult = {
    status: ActionResultStatuses.SUCCESS,
    message: "成功しました",
  };

  renderHook(() => useActionResultNotifier(actionResult));

  await waitFor(() => {
    expect(mockedShowNotification).toHaveBeenCalledTimes(1);
    expect(mockedShowNotification).toHaveBeenCalledWith({
      type: ActionResultStatuses.SUCCESS,
      message: "成功しました",
    });
  });
});

it("アクション結果が失敗の場合、メッセージが表示されること", async () => {
  const actionResult = {
    status: ActionResultStatuses.ERROR,
    message: "失敗しました",
  };

  renderHook(() => useActionResultNotifier(actionResult));

  await waitFor(() => {
    expect(mockedShowNotification).toHaveBeenCalledTimes(1);
    expect(mockedShowNotification).toHaveBeenCalledWith({
      type: ActionResultStatuses.ERROR,
      message: "失敗しました",
    });
  });
});

it("アクション結果がない場合、メッセージが表示されないこと", async () => {
  renderHook(() => useActionResultNotifier(null));

  await waitFor(() => {
    expect(mockedShowNotification).not.toHaveBeenCalled();
  });
});
