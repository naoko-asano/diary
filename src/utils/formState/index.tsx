export type FormState = {
  result: (typeof FormResult)[keyof typeof FormResult] | null;
};

export const FormResult = {
  SUCCESS: "success",
  ERROR: "error",
} as const;
