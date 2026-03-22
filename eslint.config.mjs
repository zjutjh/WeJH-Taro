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
      // TODO: 历史文件有很多命名不符合新规范， 逐步修改，暂时先 warning
      "unicorn/filename-case": "warn"
    }
  }
);
