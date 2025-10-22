import Taro from "@tarojs/taro";

import { serviceStore } from "@/store";

import { LoginByTaro } from "./services/authService";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

const request = async <TData>(url: string, config: Omit<Taro.request.Option, "url">) => {
  if (config.header && !config.header.Cookie) {
    await LoginByTaro();
    config.header.Cookie = serviceStore.sessionID;
  }
  return Taro.request<IResponse<TData>>({
    ...globalConfig,
    url,
    ...config
  });
};

export default request;
