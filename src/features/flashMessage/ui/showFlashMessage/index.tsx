import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { FlashMessage, FlashMessageTypes } from "@/features/flashMessage/model";

export function showFlashMessage(flashMessage: FlashMessage) {
  const { type, message } = flashMessage;
  const isSuccessful = type === FlashMessageTypes.SUCCESS;

  notifications.show({
    title: <Text size="xs">{isSuccessful ? "Success" : "Error"}</Text>,
    message: (
      <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
        {message}
      </Text>
    ),
    icon: isSuccessful ? <IconCheck size={20} /> : <IconX size={20} />,
    color: isSuccessful ? "teal" : "red",
  });
}
