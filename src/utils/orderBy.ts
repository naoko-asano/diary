export const ORDER_BY_VALUES = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type OrderByParams<T> = Partial<{
  [key in keyof T]: (typeof ORDER_BY_VALUES)[keyof typeof ORDER_BY_VALUES];
}>;
