"use client";

import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";

import { FormResult, FormState } from "@/utils/formState";

interface Props {
  formState: FormState;
  message: string;
}

function showFlashMessage(props: Props) {
  const isSuccessful = props.formState.result === FormResult.SUCCESS;

  notifications.show({
    title: <Text size="xs">{isSuccessful ? "Success" : "Error"}</Text>,
    message: <Text size="xs">{props.message}</Text>,
    icon: isSuccessful ? <IconCheck size={20} /> : <IconX size={20} />,
    color: isSuccessful ? "teal" : "red",
  });
}

export function FlashMessageNotifier(props: Props) {
  const { formState, message } = props;
  useEffect(() => {
    if (!formState.result) return;
    showFlashMessage({ formState, message });
  }, [formState, message]);
  return null;
}
