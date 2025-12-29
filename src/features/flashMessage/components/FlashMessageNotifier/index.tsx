"use client";

import { useEffect } from "react";

import { consumeFlashMessageComposed } from "@/features/flashMessage/composition/consumeFlashMessageComposed";

export function FlashMessageNotifier() {
  useEffect(() => {
    consumeFlashMessageComposed();
  }, []);
  return null;
}
