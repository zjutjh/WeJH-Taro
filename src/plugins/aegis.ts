import Aegis from "aegis-mp-sdk";
import { Environment } from "aegis-mp-sdk/lib/packages/core/src/interface";
import { get } from "lodash-es";

import { ServiceErrorCode } from "@/utils/request-error";
import { IResponse } from "@/utils/request-next";

const DEFAULT_ERROR_RES_CODE = -999999;

const AEGIS_ENV_MAP = {
  development: Aegis.environment.development,
  test: Aegis.environment.test,
  production: Aegis.environment.production
} satisfies Record<ImportMetaEnv["VITE_BUILD_ENV"], Environment>;

/**
 * @see https://cloud.tencent.com/document/product/1464/58570
 */
export const aegis = new Aegis({
  id: import.meta.env.VITE_TENCENT_RUM_REPORT_KEY, // RUM 申请的上报 key
  // TODO: 用户唯一 ID（可选）
  // uin: "xxx", // 用户唯一 ID（可选）
  reportApiSpeed: true, // 接口测速
  spa: true, // 是否在小程序页面跳转时进行 PV 上报。
  api: {
    retCodeHandler: (data: unknown) => {
      const code = get(data as IResponse<unknown>, "code", DEFAULT_ERROR_RES_CODE);

      return {
        isErr: code !== ServiceErrorCode.OK,
        code
      };
    }
  },
  env: AEGIS_ENV_MAP[import.meta.env.VITE_BUILD_ENV]
});
