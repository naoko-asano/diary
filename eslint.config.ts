import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginImport from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "src/generated/**/*",
  ]),
  {
    plugins: {
      import: pluginImport,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
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
]);

export default eslintConfig;
