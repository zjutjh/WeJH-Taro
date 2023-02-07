import Taro from "@tarojs/taro";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T
}

const globalConfig: Partial<Taro.request.Option> = {
  timeout: 12 * 1000
};

// eslint-disable-next-line no-undef
const request =<TData extends TaroGeneral.IAnyObject | any> (
  url: string,
  config: Omit<Taro.request.Option, "url">,
) => {
  return Taro.request<IResponse<TData>>({
    ...globalConfig,
    url,
    ...config
  });

};

export default request;
