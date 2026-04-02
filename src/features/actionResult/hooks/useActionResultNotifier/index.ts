import { useEffect } from "react";

import { ActionResult } from "@/features/actionResult/model";
import { showNotification } from "@/features/notifications/presenter/showNotification";

export function useActionResultNotifier(actionResult: ActionResult) {
  useEffect(() => {
    if (!actionResult) return;

    showNotification({
      type: actionResult.status,
      message: actionResult.message,
    });
  }, [actionResult]);
}
