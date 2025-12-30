export interface ActionResult {
  status: ActionResultStatus;
  message?: string;
}

type ActionResultStatus =
  (typeof ActionResultStatuses)[keyof typeof ActionResultStatuses];

export const ActionResultStatuses = {
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
} as const;
