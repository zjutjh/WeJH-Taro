import zjutjh from "@zjutjh/eslint-config";

export default zjutjh(
  {
    prettier: {
      lang: {
        css: false
      }
    }
  },
  {
    rules: {
      "unicorn/filename-case": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ]
    }
  }
);
