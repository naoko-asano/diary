"use client";

import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";

interface Props {
  type: "success" | "error";
  message: string;
}

const checkIcon = <IconCheck size={20} />;
const xIcon = <IconX size={20} />;

export function FlashMessageNotifier(props: Props) {
  useEffect(() => {
    const hasError = props.type === "error";
    notifications.show({
      title: hasError ? "Error" : "Success",
      message: props.message,
      icon: hasError ? xIcon : checkIcon,
    });
  }, [props]);
  return null;
}
