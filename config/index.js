import path from "path";
const dotenv = require("dotenv");
const myEnv = dotenv.config();

const config = {
  projectName: "WeJh-Taro",
  date: "2021-4-20",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: "src",
  outputRoot: "dist",
  copy: {
    patterns: [],
    options: {}
  },
  framework: "vue3",
  compiler: "webpack5",
  cache: {
    enable: false
  },
  alias: {
    "@/assets": path.resolve(__dirname, "..", "src/assets"),
    "@/store": path.resolve(__dirname, "..", "src/store"),
    "@/utils": path.resolve(__dirname, "..", "src/utils"),
    "@/hooks": path.resolve(__dirname, "..", "src/hooks"),
    "@/types": path.resolve(__dirname, "..", "src/types"),
    "@/services": path.resolve(__dirname, "..", "src/services"),
    "@/constants": path.resolve(__dirname, "..", "src/constants"),
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/style": path.resolve(__dirname, "..", "src/style")
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    }
  }
};

module.exports = function (merge) {
  const myEnvParsed = Object.keys(myEnv.parsed).reduce((acc, cur) => {
    acc[cur] = JSON.stringify(myEnv.parsed[cur]);
    return acc;
  }, {});

  const myConfig = {
    env: myEnvParsed
  };

  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"), myConfig);
  }
  return merge({}, config, require("./prod"), myConfig);
};
