import Taro from "@tarojs/taro";

import { LoginByTaro } from "@/services";
import { serviceStore } from "@/store";

import RequestError, { MPErrorCode, ServiceErrorCode } from "./requestError";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

const request = async <TData>(config: Taro.request.Option) => {
  // 检查 Session 是否为空，是则尝试重新登录
  if (config.header && !config.header.Cookie) {
    await LoginByTaro();
    config.header.Cookie = serviceStore.sessionID;
  }
  try {
    const { data: realResponse } = await Taro.request<IResponse<TData> | undefined>({
      ...globalConfig,
      ...config
    });
    if (!realResponse) {
      throw new RequestError("小程序网络异常", MPErrorCode.MP_INVALID_RESPONSE_BODY);
    }
    if (realResponse.code !== ServiceErrorCode.OK) {
      throw new RequestError(realResponse.msg, realResponse.code);
    }
    return realResponse.data;
  } catch (e) {
    console.error(e);
    throw e instanceof RequestError
      ? e
      : new RequestError("小程序网络异常", MPErrorCode.MP_NETWORK_ERROR);
  }
};

export default request;
