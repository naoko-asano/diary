export interface ActionResult {
  status: ActionResultStatus;
  message?: string;
}

export type ActionResultStatus =
  (typeof ActionResultStatuses)[keyof typeof ActionResultStatuses];

export const ActionResultStatuses = {
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
} as const;
