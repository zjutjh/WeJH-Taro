import { buildDate, commit } from "./utils/version";
import PackageJson from "../package.json";
import path from "path";
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
  defineConstants: {
    APP_VERSION: JSON.stringify(PackageJson.version),
    "process.env.APP_NAME": JSON.stringify(PackageJson.name),
    "process.env.COMMIT_HASH": JSON.stringify(commit),
    "process.env.BUILD_TIME": JSON.stringify(buildDate),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: "vue3",
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
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
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
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
