import js from "@eslint/js";
import vueEslintPlugin from "eslint-plugin-vue";
import importPlugin from "eslint-plugin-import";
import stylisticEslintPlugin from "@stylistic/eslint-plugin";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import globals from "globals";

export default [
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...vueEslintPlugin.configs["flat/recommended"],
  ...vueTsEslintConfig(),
  {
    plugins: {
      "@stylistic": stylisticEslintPlugin
    },
    rules: {
      "camelcase": "warn",
      "no-warning-comments": "warn",
      "no-console": ["warn", { allow: [ "warn", "error" ] }],
      "no-var": "error",
      "no-undef": "off", // ts 和 vue lang="ts" 中，eslint 无法识别全局类型定义，所以关闭。仅靠 ts 就能检查未定义的变量
      "prefer-const": "warn",

      "@stylistic/indent": ["error", 2],
      "@stylistic/keyword-spacing": "error",
      "@stylistic/key-spacing": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/function-call-spacing": "error",
      "@stylistic/semi": "error",
      "@stylistic/no-multiple-empty-lines": ["warn", { max: 1 }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/block-spacing": "error",
      "@stylistic/brace-style": "error",
      "@stylistic/comma-dangle": "error",
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/comma-spacing": "error",
      "@stylistic/switch-colon-spacing": "error",
      "@stylistic/type-annotation-spacing": "error",

      "@stylistic/space-before-blocks": "error",
      "@stylistic/space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }],
      "@stylistic/space-in-parens": "error",
      "@stylistic/space-infix-ops": "error",
      "@stylistic/spaced-comment": "error",

      "@typescript-eslint/no-explicit-any": "off"
    },
    settings: {
      "import/resolver": {
        "typescript": true
      }
    }
  },
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/component-name-in-template-casing": ["error", "kebab-case", { "registeredComponentsOnly": true }],
      "vue/max-attributes-per-line": ["error", { "singleline": { "max": 3 } }]
    }
  },
  {
    files: ["config/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "no-undef": "error"
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    ignores: [
      "dist/*",
      ".swc/*",
      ".github/*"
    ]
  }
];
