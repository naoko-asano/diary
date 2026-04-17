import { NOTIFICATION_TYPES } from "@/features/notifications/model";

import { popNotification, storeNotification } from ".";

const baseRepository = {
  find: async () => null,
  store: async () => {},
  remove: async () => {},
};

describe("通知の保存", () => {
  it("通知が保存される", async () => {
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
    expect(repository.store).toHaveBeenCalledWith(notification);
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
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).toHaveBeenCalledWith();
    expect(repository.remove).toHaveBeenCalledTimes(1);
    expect(repository.remove).toHaveBeenCalledWith();
  });

  it("通知が存在しない場合、nullを返す", async () => {
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue(null),
      remove: vi.fn(),
    };

    const result = await popNotification(repository);

    expect(result).toBeNull();
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).toHaveBeenCalledWith();
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it("通知の形式が不正な場合、nullを返し、通知を削除する", async () => {
    const repository = {
      ...baseRepository,
      find: vi.fn().mockResolvedValue({ invalid: "data" }),
      remove: vi.fn(),
    };

    const result = await popNotification(repository);

    expect(result).toBeNull();
    expect(repository.find).toHaveBeenCalledTimes(1);
    expect(repository.find).toHaveBeenCalledWith();
    expect(repository.remove).toHaveBeenCalledTimes(1);
    expect(repository.remove).toHaveBeenCalledWith();
  });
});
