export type ActionResult = {
  status:
    | typeof ActionResultStatuses.SUCCESS
    | typeof ActionResultStatuses.ERROR;
  message: string;
} | null;

export type ActionResultStatus =
  (typeof ActionResultStatuses)[keyof typeof ActionResultStatuses];

export const ActionResultStatuses = {
  SUCCESS: "success",
  ERROR: "error",
} as const;
