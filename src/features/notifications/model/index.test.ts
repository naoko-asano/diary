import { assertNotification, Notification, NOTIFICATION_TYPES } from "./index";

describe("通知のアサーション", () => {
  it("通知型の場合、エラーをスローしない", () => {
    const notification: Notification = {
      type: NOTIFICATION_TYPES.SUCCESS,
      message: "成功しました",
    };

    expect(() => assertNotification(notification)).not.toThrow();
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["空オブジェクト", {}],
    ["typeなし", { type: NOTIFICATION_TYPES.SUCCESS }],
    ["messageなし", { message: "メッセージのみ" }],
    ["type無効", { type: "invalid", message: "無効な通知" }],
  ])("%sの場合、エラーをスローする", (_, invalidValue) => {
    expect(() => assertNotification(invalidValue)).toThrow(
      "Invalid notification",
    );
  });
});
