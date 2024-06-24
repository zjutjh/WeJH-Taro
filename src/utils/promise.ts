import RequestError, { MPErrorCode } from "./request/requestError";

/**
 * 当 promise 返回的结果为 null 时抛出异常
 *
 * 正方的每个接口都有较大的概率返回 data: null
 */
export function withRespDataNeverNull<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>,
  options?: {
    errMsg?: string
  }
) {
  const { errMsg = "响应数据格式异常" } = options ?? {};

  return async (...args: Args) => {
    const resp = await fetcher(...args);
    if (resp === null)
      throw new RequestError(errMsg, MPErrorCode.MP_INVALID_DATA_VALUE);

    return resp as T;
  };
}
