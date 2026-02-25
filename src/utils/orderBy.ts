export const OrderByValues = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type OrderByParams<T> = Partial<{
  [key in keyof T]: (typeof OrderByValues)[keyof typeof OrderByValues];
}>;
