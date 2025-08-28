import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
        },
      ],
    },
  },
  { ignores: ["src/generated/**/*"] },
];
