import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

import { Notification, NOTIFICATION_TYPES } from "../../model";

export function showNotification(notification: Notification) {
  const params = buildParams({ notification });
  notifications.show(params);
}

function buildParams(props: { notification: Notification }) {
  const { notification } = props;
  const { type, message } = notification;
  const success = type === NOTIFICATION_TYPES.SUCCESS;
  return {
    title: <Text size="xs">{success ? "Success" : "Error"}</Text>,
    message: (
      <Text size="xs" style={{ whiteSpace: "pre-wrap" }}>
        {message}
      </Text>
    ),
    icon: success ? <IconCheck size={20} /> : <IconX size={20} />,
    color: success ? "teal" : "red",
  };
}
