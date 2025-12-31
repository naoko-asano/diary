import { useEffect } from "react";

import {
  ActionResult,
  ActionResultStatuses,
} from "@/features/actionResult/model";
import { showFlashMessage } from "@/features/flashMessage/ui/showFlashMessage";

export function useFlashMessage(actionResult: ActionResult) {
  useEffect(() => {
    if (
      actionResult.status === ActionResultStatuses.IDLE ||
      !actionResult.message
    )
      return;

    showFlashMessage({
      type: actionResult.status,
      message: actionResult.message,
    });
  }, [actionResult]);
}
