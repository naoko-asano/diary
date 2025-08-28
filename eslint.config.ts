import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
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
      "import/order": [
        "error",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          "newlines-between-types": "ignore",
          sortTypesGroup: true,
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          named: true,
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  { ignores: ["src/generated/**/*"] },
];

export default eslintConfig;
