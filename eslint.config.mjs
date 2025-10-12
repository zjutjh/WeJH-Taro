import zjutjh from "@zjutjh/eslint-config";

export default zjutjh(
  {
    prettier: true
  },
  {
    rules: {
      "unicorn/filename-case": "off"
    }
  }
);
