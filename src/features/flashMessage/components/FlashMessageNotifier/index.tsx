"use client";

import { useEffect } from "react";

import { consumeFlashMessageComposed } from "@/features/flashMessage/composition/consumeFlashMessageComposed";

/**
 * フォーム送信後のリダイレクト先で、フラッシュメッセージを表示するコンポーネント
 */
export function FlashMessageNotifier() {
  useEffect(() => {
    consumeFlashMessageComposed();
  }, []);
  return null;
}
