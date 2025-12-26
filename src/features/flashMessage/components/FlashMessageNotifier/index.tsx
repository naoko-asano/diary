"use client";

import { useEffect } from "react";

import { consumeFlashMessage } from "@/features/flashMessage/usecases/consumeFlashMessage";

export function FlashMessageNotifier() {
  useEffect(() => {
    consumeFlashMessage();
  }, []);
  return null;
}
