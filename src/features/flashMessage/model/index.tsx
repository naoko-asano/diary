type FlashMessageType =
  (typeof FlashMessageTypes)[keyof typeof FlashMessageTypes];

export interface FlashMessage {
  type: FlashMessageType;
  message: string;
}

export type FlashMessageCookieConfig = ReturnType<
  typeof createFlashMessageCookieConfig
>;

export const FLASH_MESSAGE_COOKIE_NAME = "flash-message";

export const FlashMessageTypes = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export function assertFlashMessage(
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): asserts value is FlashMessage {
  if (
    value &&
    value.type &&
    value.message &&
    Object.values(FlashMessageTypes).includes(value.type)
  ) {
    return;
  }

  throw new Error("Invalid flash message");
}

export function createFlashMessageCookieConfig(flashMessage: FlashMessage) {
  return {
    name: FLASH_MESSAGE_COOKIE_NAME,
    value: JSON.stringify({
      type: flashMessage.type,
      message: flashMessage.message,
    }),
    httpOnly: false,
    maxAge: 30,
  };
}

export function parseFlashMessageCookie(cookie?: {
  value: string;
}): FlashMessage | null {
  if (!cookie) return null;
  try {
    const parsedCookieValue = JSON.parse(cookie.value);
    assertFlashMessage(parsedCookieValue);
    return parsedCookieValue;
  } catch {
    return null;
  }
}
