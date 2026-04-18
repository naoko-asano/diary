export interface Notification {
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
  message: string;
}

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertNotification(value: any): asserts value is Notification {
  if (
    value &&
    value.type &&
    value.message &&
    Object.values(NOTIFICATION_TYPES).includes(value.type)
  ) {
    return;
  }

  throw new Error("Invalid notification");
}
