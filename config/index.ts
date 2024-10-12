import { UserConfigExport, defineConfig } from "@tarojs/cli";
import devConfig from "./dev";
import prodConfig from "./prod";
import path from "path";

export default defineConfig<"vite">(async (merge) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "WeJh-Taro",
    date: "2021-4-20",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: "src",
    outputRoot: "dist",
    copy: {
      patterns: [],
      options: {}
    },
    plugins: [],
    framework: "vue3",
    compiler: "vite",
    alias: {
      "@": path.resolve(__dirname, "..", "src")
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        }
      }
    }
  };

  if (process.env.NODE_ENV === "development") {
    return merge({}, baseConfig, devConfig);
  }

  return merge({}, baseConfig, prodConfig);
});
