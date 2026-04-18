import { assertNotification, Notification, NOTIFICATION_TYPES } from "./index";

describe("通知のアサーション", () => {
  it.each([
    {
      type: NOTIFICATION_TYPES.SUCCESS,
      message: "成功しました",
    },
    {
      type: NOTIFICATION_TYPES.ERROR,
      message: "エラーが発生しました",
    },
  ])("有効な通知の場合、エラーをスローしない", (validValue) => {
    expect(() => assertNotification(validValue)).not.toThrow();
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
