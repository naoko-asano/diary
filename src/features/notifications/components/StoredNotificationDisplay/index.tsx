"use client";

import { useEffect } from "react";

import { popNotification } from "@/features/notifications";
import { showNotification } from "@/features/notifications/presenter/showNotification";

export function StoredNotificationDisplay() {
  useEffect(() => {
    (async () => {
      try {
        const notification = await popNotification();
        if (!notification) return;
        showNotification(notification);
      } catch {
        // noop
      }
    })();
  }, []);
  return null;
}
