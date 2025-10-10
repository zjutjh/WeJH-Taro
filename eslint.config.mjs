import zjutjh from "@zjutjh/eslint-config";

export default zjutjh({
  overrides: {
    vue: {
      "vue/component-name-in-template-casing": [
        "error",
        "kebab-case",
        {
          registeredComponentsOnly: false
        }
      ]
    }
  },
});
