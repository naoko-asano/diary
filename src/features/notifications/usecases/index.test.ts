import { NOTIFICATION_TYPES } from "../model";

import { popNotification, storeNotification } from ".";

const baseRepository = {
  find: async () => null,
  store: async () => {},
  remove: async () => {},
};

describe("通知の保存", () => {
  it("通知が保される", async () => {
    const notification = {
      type: NOTIFICATION_TYPES.SUCCESS,
      message: "message",
    };
    const repository = {
      ...baseRepository,
      store: vi.fn(),
    };

    await storeNotification(notification, repository);

    expect(repository.store).toHaveBeenCalledTimes(1);
    expect(repository.store).toHaveBeenCalledWith({
      name: "notification",
      value: JSON.stringify(notification),
      httpOnly: true,
      maxAge: 30,
    });
  });
});

describe("通知のポップ処理", () => {
  it("通知が存在する場合、通知を取得して削除する", async () => {
    const notification = {
      type: NOTIFICATION_TYPES.SUCCESS,
      message: "message",
    };
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(notification),
      remove: vi.fn(),
    };

    const result = await popNotification(repository);

    expect(result).toEqual(notification);
    expect(repository.remove).toHaveBeenCalledTimes(1);
    expect(repository.remove).toHaveBeenCalledWith("notification");
  });

  it("通知が存在しない場合、nullを返す", async () => {
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
    };

    const result = await popNotification(repository);

    expect(result).toBeNull();
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
