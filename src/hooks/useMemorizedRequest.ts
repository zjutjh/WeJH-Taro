import { useRequestNext, UseRequestOptions } from "./useRequest";
import { persistedStorage } from "@/utils";
import { computed, ref } from "vue";

const keyPrefix = "__request";

/**
 * 处理 key，提取其中的第一部分，并加上前缀作为 Domain，其
 * 余部分作为 Path。
 *
 * @param key 用户传入的 Key
 * @returns 解析后的结果，Domain 是持久化存储的 Key，Path 是
 * 存储数据对象中的 Key。
 */
function parseKey(key: string) {
  if (key.startsWith("/") || key.endsWith("/")) console.warn("Do not use slash on the start or end of a key.");

  const [domain, ...rest] = key.split("/");
  const path = rest.join("/");

  return {
    domain: `${keyPrefix}/${domain}`,
    path
  };
}

type StorageItem<Data> = {
  updateTime: number;
  value: Data;
};

/**
 * 根据特定结构的 Key，对持久化数据进行操作
 *
 * 利用 wx 特性，没有序列化数据对象成字符串，而是直接
 * 存入对象，减少序列化性能消耗
 */
const requestStorage = {
  setItem<Data>(key: string, value: Data): number {
    const { domain, path } = parseKey(key);
    let root = persistedStorage.getItem(domain) as Record<string, StorageItem<Data>> | "";
    if (!root) root = {};
    const now = Date.now();
    root[path] = { value, updateTime: now };
    persistedStorage.setItem(domain, root);
    return now;
  },
  getItem<Data>(key: string): StorageItem<Data> | undefined {
    const { domain, path } = parseKey(key);
    const root = persistedStorage.getItem(domain) as Record<string, StorageItem<Data>> | "";
    if (root && path in root) return root[path];
    return undefined;
  },
  removeItem(key: string) {
    const { domain, path } = parseKey(key);
    const root = persistedStorage.getItem(domain) as Record<string, string> | "";
    if (!root) return;
    delete root[path];
    persistedStorage.setItem(domain, root);
  }
};

/**
 * 接入持久化缓存能力的 useRequest
 *
 * @param getKey 缓存的 key，可以传入函数，依据 fetcher 的参数，动态计算出缓存 key
 * @param fetcher 请求函数，可以扩展 promise utils
 * @param options useRequest 的所有参数
 *
 * @returns mutate - 相当于 `run`，表示发起请求更新缓存，缓存的 key 由他传入的参数，以及 `getKey` 决定
 * @returns updateTime - 上次缓存成功更新的时间
 * @returns validating - 正在从离线缓存更新到在线缓存，可以看作首次请求的 loading
 */
export default function useMemorizedRequest<Data, Params extends Record<string, any>>(
  getKey: string | ((params?: Params) => string),
  fetcher: (params?: Params) => Promise<Data>,
  options: UseRequestOptions<Data, Params>
) {
  const key = ref(typeof getKey === "function" ? getKey(options.defaultParams) : getKey);
  const validating = ref(false);
  const _updateTime = ref<number>();

  const { data: rawData, run: mutate, ...restUseRequestReturned } = useRequestNext(
    fetcher, {
      ...options,
      manual: true,
      onSuccess: (res, params) => {
        options.onSuccess?.(res, params);
        const key = typeof getKey === "function" ? getKey(params) : getKey;
        _updateTime.value = requestStorage.setItem(key, res);
      }
    }
  );

  if (!options.manual) {
    validating.value = true;
    mutate(options.defaultParams)
      .finally(() => validating.value = false);
  }

  const storeItem = computed(() => {
    const data = requestStorage.getItem<Data>(key.value);
    return data;
  });

  const updateTime = computed(() => {
    if (validating.value) return storeItem.value?.updateTime ?? Date.now();
    return _updateTime.value!;
  });

  const data = computed(() => {
    if (validating.value) return storeItem.value?.value ?? options.initialData;
    else return rawData.value;
  });

  return {
    ...restUseRequestReturned,
    validating,
    mutate,
    updateTime,
    data
  };
}
