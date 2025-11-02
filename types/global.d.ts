import type RequestError from "@/utils/request-error";

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    readonly NODE_ENV: "development" | "production";
    /** 当前构建的平台 */
    readonly TARO_ENV:
      | "weapp"
      | "swan"
      | "alipay"
      | "h5"
      | "rn"
      | "tt"
      | "qq"
      | "jd"
      | "harmony"
      | "jdrn";
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    readonly TARO_APP_ID: string;
  }
}

interface CustomMeta extends Record<string, unknown | undefined> {
  /** 是否要持久化 */
  persist?: boolean;
}

declare module "@tanstack/vue-query" {
  interface Register {
    queryMeta: CustomMeta;
    defaultError: RequestError;
  }
}
