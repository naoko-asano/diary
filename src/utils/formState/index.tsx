export type FormState = {
  result: FormResult | null;
};

export type FormResult = (typeof FormResult)[keyof typeof FormResult];

export const FormResult = {
  SUCCESS: "success",
  ERROR: "error",
} as const;
