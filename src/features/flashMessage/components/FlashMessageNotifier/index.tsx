"use client";

import { useEffect } from "react";

import { consumeFlashMessageComposed } from "../../composition/consumeFlashMessageComposed";

export function FlashMessageNotifier() {
  useEffect(() => {
    consumeFlashMessageComposed();
  }, []);
  return null;
}
