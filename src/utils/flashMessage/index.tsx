import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { FormResult, FormState } from "@/utils/formState";

export const FLASH_MESSAGE_COOKIE_NAME = "flash-message";

export function showFlashMessage(props: {
  formState: FormState;
  message: string;
}) {
  if (!props.formState.result) return;
  const isSuccessful = props.formState.result === FormResult.SUCCESS;

  notifications.show({
    title: <Text size="xs">{isSuccessful ? "Success" : "Error"}</Text>,
    message: <Text size="xs">{props.message}</Text>,
    icon: isSuccessful ? <IconCheck size={20} /> : <IconX size={20} />,
    color: isSuccessful ? "teal" : "red",
  });
}

export function createFlashMessageCookieConfig({
  type,
  message,
}: {
  type: "success" | "error";
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
  const parsedCookieValue = JSON.parse(cookie.value);
  if (!parsedCookieValue.type || !parsedCookieValue.message) {
    throw new Error("Cookie is not for flash Message");
  }
  return {
    formState: { result: parsedCookieValue.type },
    message: parsedCookieValue.message,
  };
}
