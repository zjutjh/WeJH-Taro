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
      "unicorn/filename-case": "off"
    }
  }
);
