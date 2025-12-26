import Taro from "@tarojs/taro";
import { first, isNil } from "lodash-es";
import urlcat from "urlcat";

import { RequestFnParams } from "@/api/services/base";
import { QUERY_KEY } from "@/services/api/query-key";

import RequestError, { MPErrorCode, ServiceErrorCode } from "./request-error";
import { globalQueryClient } from "./vue-query";

export interface IResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

export interface RequestCustomOptions {
  /**
   * 请求是否携带 Cookie，若没有 Cookie 还请求则会触发登录获取 Cookie
   *
   * @default true
   */
  auth?: boolean;
  /**
   * 是否直接返回响应数据，不进行 code 校验
   * 适用于重定向下载等非标准 JSON 响应的场景
   *
   * @default false
   */
  isRaw?: boolean;
}

/**
 * 发送接收 application/json 请求
 *
 * @throws {RequestError}
 * @returns 转换成对象的响应 JSON 数据
 */
export async function requestNext<Data>(
  { url, method, params, data }: RequestFnParams,
  { auth = true, isRaw = false }: RequestCustomOptions | undefined = {}
): Promise<Data> {
  try {
    const cookie = auth
      ? await globalQueryClient.fetchQuery({
          queryKey: [QUERY_KEY.USER_COOKIE] as const,
          queryFn: refreshCookie,
          staleTime: Infinity
        })
      : "";
    const { data: realResponse } = await Taro.request<IResponse<Data> | Data | undefined>({
      ...globalConfig,
      // Taro.request 对于 GET 和 POST 的请求都共用 data 传参，POST 请求时无法拼接 url query，这里手动拼接
      url: isNil(params) ? url : urlcat(url, params),
      method,
      header: { Cookie: cookie },
      data
    });

    if (!realResponse)
      throw new RequestError("小程序网络异常", MPErrorCode.MP_INVALID_RESPONSE_BODY);

    // FIXME: 处理这个逻辑
    if (isRaw) {
      return realResponse as Data;
    }

    const res = realResponse as IResponse<Data>;

    if (res.code !== ServiceErrorCode.OK) {
      if (res.code === ServiceErrorCode.USER_NOT_LOGIN && cookie)
        // Cookie 过期，调用登录接口刷新 Cookie，之后抛出错误后利用请求重试，在新一轮请求中拿到 Cookie
        await globalQueryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_COOKIE] as const });
      throw new RequestError(res.msg, res.code);
    }

    return res.data;
  } catch (e: unknown) {
    console.error(e);
    throw e instanceof RequestError
      ? e
      : new RequestError("小程序网络异常", MPErrorCode.MP_NETWORK_ERROR);
  }
}

export const refreshCookie = async (): Promise<string> => {
  const { code } = await Taro.login({ timeout: 3000 });
  const url = `${import.meta.env.VITE_HOST}/api/user/login/wechat`;
  const method = "POST";
  const data = { code };

  const { cookies } = await Taro.request({ url, method, data });

  return first(cookies) ?? "";
};
