/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 构建产物的环境 */
  readonly VITE_BUILD_ENV: "development" | "test" | "production";
  /** 业务请求域名 */
  readonly VITE_HOST: string;
  /** 电费通知的模板 id */
  readonly VITE_ELECTRICITY_SUBSCRIBE_TEMPLATE_ID: string;
  /** 腾讯云 RUM 上报 key */
  readonly VITE_TENCENT_RUM_REPORT_KEY: string;
}
