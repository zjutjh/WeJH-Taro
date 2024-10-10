import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";

export default [
  ...pluginVue.configs["flat/recommended"],
  ...vueTsEslintConfig(),
  {
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      camelcase: "warn",
      semi: "error",
      "no-trailing-spaces": "error",
      "linebreak-style": ["error", "unix"],
      "no-warning-comments": "warn",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    }
  },
  {
    files: ["config/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    ignores: [
      "dist/*",
      ".swc/*",
      ".github/*"
    ],
  }
];
