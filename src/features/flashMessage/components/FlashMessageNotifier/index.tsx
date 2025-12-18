"use client";

import { useEffect } from "react";

import { FlashMessageType } from "@/features/flashMessage/model";
import { showFlashMessage } from "@/features/flashMessage/ui/showFlashMessage";

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
