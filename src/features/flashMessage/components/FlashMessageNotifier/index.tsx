"use client";

import { useEffect } from "react";

import { consumeFlashMessage } from "@/features/flashMessage/model/consumeFlashMessage";

export function FlashMessageNotifier() {
  useEffect(() => {
    consumeFlashMessage();
  }, []);
  return null;
}
