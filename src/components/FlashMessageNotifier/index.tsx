"use client";

import { useEffect } from "react";

import { FlashMessageType, showFlashMessage } from "@/utils/flashMessage";

interface Props {
  type: FlashMessageType;
  message: string;
}

export function FlashMessageNotifier(props: Props) {
  const { type, message } = props;
  useEffect(() => {
    showFlashMessage({ type, message });
  }, [type, message]);
  return null;
}
