import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const FLASH_MESSAGE_COOKIE_NAME = "flash-message";

export const FlashMessageTypes = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type FlashMessageType =
  (typeof FlashMessageTypes)[keyof typeof FlashMessageTypes];

export function showFlashMessage(props: {
  type: FlashMessageType;
  message: string;
}) {
  const isSuccessful = props.type === FlashMessageTypes.SUCCESS;

  notifications.show({
    title: <Text size="xs">{isSuccessful ? "Success" : "Error"}</Text>,
    message: (
      <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
        {props.message}
      </Text>
    ),
    icon: isSuccessful ? <IconCheck size={20} /> : <IconX size={20} />,
    color: isSuccessful ? "teal" : "red",
  });
}

export function createFlashMessageCookieConfig({
  type,
  message,
}: {
  type: FlashMessageType;
  message: string;
}) {
  return {
    name: FLASH_MESSAGE_COOKIE_NAME,
    value: JSON.stringify({
      type,
      message,
    }),
    httpOnly: false,
    maxAge: 1,
  };
}

export function resolveFlashMessageContent(cookie?: { value: string }) {
  if (!cookie) return null;
  try {
    const parsedCookieValue = JSON.parse(cookie.value);
    if (!parsedCookieValue.type || !parsedCookieValue.message) {
      throw new Error("Cookie is not for flash Message");
    }
    return {
      type: parsedCookieValue.type,
      message: parsedCookieValue.message,
    };
  } catch {
    return null;
  }
}
