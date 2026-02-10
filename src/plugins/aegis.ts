import Aegis from "aegis-mp-sdk";
import { Environment } from "aegis-mp-sdk/lib/packages/core/src/interface";
import { get } from "lodash-es";

import { ServiceErrorCode } from "@/utils/request-error";
import { IResponse } from "@/utils/request-next";

const FALLBACK_BIZ_ERROR_CODE = -999999;
const FALLBACK_UNI = "DEFAULT_UNI";

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
  uin: FALLBACK_UNI, // 用户学号，请求到学号之前用默认值
  reportApiSpeed: true,
  spa: true,
  api: {
    retCodeHandler: (data: unknown) => {
      const code = get(data as IResponse<unknown>, "code", FALLBACK_BIZ_ERROR_CODE);

      return {
        isErr: code !== ServiceErrorCode.OK,
        code
      };
    }
  },
  // setData 和页面渲染性能相关，且上报频率较高，不需要监控
  setDataReportConfig: {
    disabled: true
  },
  pagePerformance: false
});

type EventName = "WjhFuncView" | "WjhFuncClick";

interface EventPayload {
  /** 模块名称 */
  moduleName?: string;
  /** 功能名称 */
  funcName?: string;
  /** 额外的参数 */
  extra?: string;
}

export function aegisReportEvent(eventName: EventName, data?: EventPayload) {
  aegis.reportEvent({
    name: eventName,
    ext1: JSON.stringify(data)
  });
}
