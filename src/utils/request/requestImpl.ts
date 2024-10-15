import Taro from "@tarojs/taro";
import RequestError, { MPErrorCode, ServiceErrorCode } from "./errorHandler";
import { serviceStore } from "@/store";

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
  method: keyof Taro.request.Method;
  params?: P;
  /** 将请求参数转换成 snack case，将响应数据转换成 camel case */
  useCamelCase?: boolean;
};

/**
 * 发送接收 application/json 请求
 *
 * @param url 请求地址，不包含协议和域名，会和 `options.urlPrefix` 组成完整的地址
 * @param params GET 请求的 Query 参数，其他请求的 Body 数据
 * @param options
 * @throws `RequestError` Instance
 * @returns 转换成对象的响应 JSON 数据
 */
async function request<Data, Params = Record<string, any>>(
  url: string,
  options?: RequestOptionsType<Params>
): Promise<Data> {
  const {
    urlPrefix = process.env.HOST,
    method = "GET",
    params
  } = options || {};

  try {
    const taroWrapped = await Taro.request<IResponse<Data>>({
      ...globalConfig,
      url: urlPrefix + url,
      method,
      header: {
        "Cookie": serviceStore.sessionID
      },
      data: params
    });

    const realResponse = taroWrapped.data;
    if (realResponse.code === ServiceErrorCode.OK) {
      return realResponse.data;
    }
    return Promise.reject(
      new RequestError({ message: realResponse.msg, code: realResponse.code })
    );
  } catch (e: any) {
    let message: string;
    if (e.errMsg) {
      // 微信小程序 request 若抛出错误，一定有 errMsg
      message = "小程序请求错误";
      console.error("[微精弘底层]请求发送失败", e);
    } else {
      message = "小程序未知网络错误";
      console.error("[微精弘底层]未知网络异常", e);
    }

    throw new RequestError({ message, code: MPErrorCode.MP_NETWORK_ERROR });
  }
}

export default request;
