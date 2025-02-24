
import Taro from "@tarojs/taro";
import { onMounted, ref } from "vue";

interface RequestConfigType<TData extends TaroGeneral.IAnyObject, TParams> {
  /** 是否手动发起请求 */
  manual?: boolean;

  /** 自动发起请求的默认参数 */
  defaultParams?: TParams;

  /** loading 延迟 单位 ms */
  loadingDelay?: number;

  /**
   * 发送请求之前 hook
   * @param response
   */
  onBefore?: () => void;

  /**
   * 成功接收到响应 hook
   * @param response 响应体
   */
  onSuccess?: (response: Taro.request.SuccessCallbackResult<TData>) => void;

  /**
   * 请求失败，业务错误 hook
   * @param error 业务错误 / 请求错误
   * @returns 要被 toast 的错误信息
   */
  onError?: (error: Error | { errMsg: string }) => string | void;

  /** 请求结束后 (不管是否有 error) hook */
  onFinally?: () => void;
}

/**
 * 封装请求成 hook
 *
 * 为请求函数扩展
 *   - 启动选项
 *   - 状态处理
 * @template TData 响应的`data`的类型
 * @param service 请求函数
 * @param config 启动选项
 * @returns
 */
const useRequest = <TData extends TaroGeneral.IAnyObject, TParams>(
  service: (params?: TParams) => Promise<Taro.request.SuccessCallbackResult<TData>>,
  config?: RequestConfigType<TData, TParams>
) => {
  const loading = ref(false);
  const data = ref<TData>();
  const error = ref<Error | { errMsg: string }>();

  const fetch = (params?: TParams) => {
    data.value = undefined;
    error.value = undefined;
    config?.onBefore?.();

    let timer: NodeJS.Timeout | undefined;
    if (config?.loadingDelay) {
      timer = setTimeout(() => {
        loading.value = true;
      }, config.loadingDelay);
    } else {
      loading.value = true;
    }

    service(params || config?.defaultParams).then((response) => {
      config?.onSuccess?.(response);
      data.value = response.data;
    }).catch((e: Error | { errMsg: string }) => {
      const errMsg = config?.onError?.(e);
      if (errMsg) Taro.showToast({ title: errMsg, icon: "none" });
      error.value = e;
    }).finally(() => {
      config?.onFinally?.();

      if (timer) clearTimeout(timer);
      loading.value = false;
    });
  };

  onMounted(() => {
    if (!config?.manual) {
      fetch();
    }
  });

  return {
    loading,
    data,
    error,
    run: fetch,
    runAsync: service
  };
};

export default useRequest;
