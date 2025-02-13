import Taro from "@tarojs/taro";
import RequestError, { MPErrorCode, ServiceErrorCode } from "./requestError";
import { globalQueryClient } from "../vueQuery";
import { UserService } from "@/services";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

type RequestOptionsType<P> = {
  urlPrefix?: string;
  method?: keyof Taro.request.Method;
  /** GET 请求的 Query 参数，其他请求的 Body 数据 */
  params?: P;
  /** TODO: 将请求参数转换成 snack case，将响应数据转换成 camel case */
  useCamelCase?: boolean;
  /** 请求是否携带 Cookie，默认为 true，若没有 Cookie 还请求则会触发登录获取 Cookie */
  auth?: boolean;
};

/**
 * 发送接收 application/json 请求
 *
 * @param url 请求地址，不包含协议和域名，会和 `options.urlPrefix` 组成完整的地址
 * @param options
 * @throws {RequestError}
 * @returns 转换成对象的响应 JSON 数据
 */
async function request<Data, Params = Record<string, any>>(
  url: string,
  options?: RequestOptionsType<Params>
): Promise<Data> {
  const {
    urlPrefix = import.meta.env.VITE_HOST,
    method = "GET",
    params,
    auth = true
  } = options || {};

  try {
    const cookie = auth ?
      await globalQueryClient.fetchQuery({
        queryKey: ["cookie"],
        queryFn: UserService.login,
        staleTime: Infinity
      }) : "";

    const { data: realResponse } = await Taro.request<IResponse<Data> | undefined>({
      ...globalConfig,
      url: urlPrefix + url,
      method,
      header: {
        "Cookie": cookie
      },
      data: params
    });

    if (!realResponse) {
      throw new RequestError("小程序网络异常", MPErrorCode.MP_INVALID_RESPONSE_BODY);
    }

    if (realResponse.code !== ServiceErrorCode.OK) {
      if (realResponse.code === ServiceErrorCode.USER_NOT_LOGIN && cookie) {
        // Cookie 过期，调用登录接口刷新 Cookie，并重新发起请求
        await globalQueryClient.invalidateQueries({
          queryKey: ["cookie"]
        }, { throwOnError: true });
        return request(url, options);
      }
      throw new RequestError(realResponse.msg, realResponse.code);
    }

    return realResponse.data;
  } catch (e: unknown) {
    console.error(e);
    throw e instanceof RequestError
      ? e
      : new RequestError("小程序网络异常", MPErrorCode.MP_NETWORK_ERROR);
  }
}

export default request;
