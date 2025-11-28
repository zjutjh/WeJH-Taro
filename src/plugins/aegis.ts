import Aegis from "aegis-mp-sdk";
import { Environment } from "aegis-mp-sdk/lib/packages/core/src/interface";
import { get } from "lodash-es";

import { ServiceErrorCode } from "@/utils/request-error";
import { IResponse } from "@/utils/request-next";

const DEFAULT_ERROR_RES_CODE = -999999;
const DEFAULT_UNI = "DEFAULT_UNI";

const AEGIS_ENV_MAP = {
  development: Aegis.environment.development,
  test: Aegis.environment.test,
  production: Aegis.environment.production
} satisfies Record<ImportMetaEnv["VITE_BUILD_ENV"], Environment>;

/**
 * 腾讯云可观测平台 aegis 日志上报
 * @see https://cloud.tencent.com/document/product/1464/58570
 */
export const aegis = new Aegis({
  env: AEGIS_ENV_MAP[import.meta.env.VITE_BUILD_ENV],
  id: import.meta.env.VITE_TENCENT_RUM_REPORT_KEY,
  uin: DEFAULT_UNI, // 用户学号，请求到学号之前用默认值
  reportApiSpeed: true,
  spa: true,
  api: {
    retCodeHandler: (data: unknown) => {
      const code = get(data as IResponse<unknown>, "code", DEFAULT_ERROR_RES_CODE);

      return {
        isErr: code !== ServiceErrorCode.OK,
        code
      };
    }
  },
  // setData 和页面渲染性能相关，且上报频率较高，不需要监控
  setDataReportConfig: {
    disabled: true
  }
});
