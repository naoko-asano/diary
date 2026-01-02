export type ActionResult =
  | {
      status: typeof ActionResultStatuses.IDLE;
    }
  | {
      status:
        | typeof ActionResultStatuses.SUCCESS
        | typeof ActionResultStatuses.ERROR;
      message: string;
    };

export type ActionResultStatus =
  (typeof ActionResultStatuses)[keyof typeof ActionResultStatuses];

export const ActionResultStatuses = {
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
} as const;
