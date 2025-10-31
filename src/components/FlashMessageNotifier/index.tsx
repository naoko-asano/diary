"use client";

import { useEffect } from "react";

import { showFlashMessage } from "@/utils/flashMessage";
import { FormState } from "@/utils/formState";

interface Props {
  formState: FormState;
  message: string;
}

export function FlashMessageNotifier(props: Props) {
  const { formState, message } = props;
  useEffect(() => {
    if (!formState.result) return;
    showFlashMessage({ type: formState.result, message });
  }, [formState, message]);
  return null;
}
