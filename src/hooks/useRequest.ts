
import Taro from "@tarojs/taro";
import { onMounted, ref, shallowRef } from "vue";

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
    // TODO: add delay
    const timer = setTimeout(() => {
      loading.value = true;
    }, config?.loadingDelay || 0);

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

type UseRequestOptions<Data, Params> = {
  /** Promise 还未 fulfilled 时，给 `data` 的初始值 */
  initialData: Data;
  /** 自动触发请求，以及调用 `run` 函数不传参数时，默认给请求函数传入的参数 */
  defaultParams?: Params;
  /** 是否手动触发请求, 默认为 false */
  manual?: boolean;
  /** 最短加载时间，默认为 0ms，在有加载动画效果时防止渲染闪屏 */
  minLoadingTime?: number;
  /** 在执行 Promise 前，将 `data` 重置为 `initialData`，默认为 false */
  resetOnRun?: boolean;
  onSuccess?: (data: Data) => void;
  onError?: (error: unknown) => void;
};

const promiseTimeout = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export function useRequestNext<State, Params extends Record<string, any>>(
  promise: (params?: Params) => Promise<State>,
  options: UseRequestOptions<State, Params>
) {
  const {
    initialData,
    defaultParams,
    manual = false,
    minLoadingTime = 0,
    resetOnRun = false,
    onSuccess,
    onError
  } = options ?? {};

  const loading = ref(false);
  const data = ref(initialData);
  const error = shallowRef<unknown | undefined>(undefined);

  async function run(params?: Params) {
    loading.value = true;
    error.value = undefined;
    if (resetOnRun) data.value = initialData;

    // 用 `allSettled` 而不用 try-catch 是为了 Delay 也作用到异常状态
    const delayedPromise = Promise.allSettled([
      promise(params ?? defaultParams),
      promiseTimeout(minLoadingTime)
    ]);
    const [promiseResult] = await delayedPromise;
    if (promiseResult.status === "fulfilled") {
      data.value = promiseResult.value;
      onSuccess?.(promiseResult.value);
    } else {
      error.value = promiseResult.reason;
      onError?.(promiseResult.reason);
    }

    loading.value = false;
  };

  if (!manual) run();

  return {
    loading,
    data,
    error,
    run
  };
}
