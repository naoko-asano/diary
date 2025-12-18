import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import {
  FlashMessageType,
  FlashMessageTypes,
} from "@/features/flashMessage/model";

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
