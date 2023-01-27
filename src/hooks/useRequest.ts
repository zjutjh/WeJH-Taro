/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Taro from "@tarojs/taro";
import { ref, onMounted } from "vue";

interface RequestConfigType<TData extends TaroGeneral.IAnyObject, TParams> {
  manual?: boolean; // 是否立即发起请求
  defaultParams?: TParams; // 默认参数
  onBefore?: () => void; // 发送请求之前做的事情
  onSuccess?: (response: Taro.request.SuccessCallbackResult<TData>) => void;
  onError?: (error: Error) => void;
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
    const error = ref<Error>();

    const fetch = (params?: TParams) => {
        loading.value = true;
        config?.onBefore?.();
        service(params || config?.defaultParams).then((response) => {
            config?.onSuccess?.(response);
            data.value = response.data;
        }).catch((e) => {
            config?.onError?.(e);
            error.value = e;
        }).finally(() => {
            config?.onFinally?.();
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
