import { useRequestNext, UseRequestOptions } from "./useRequest";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { ref } from "vue";

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
  if (key.startsWith("/") || key.endsWith("/"))
    console.warn("Do not use slash on the start or end of a key.");

  const [domain, ...rest] = key.split("/");
  const path = rest.join("/");

  return { domain: `${keyPrefix}/${domain}`, path };
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

const usePromisePool = defineStore("__request/cachedPromise", () => {
  const map = new Map<string, Promise<any>>();

  function add(key: string, p: Promise<any>) {
    map.set(key, p);
    p.finally(() => map.delete(key));
  }

  function get<Data>(key: string) {
    return map.get(key) as Promise<Data>;
  }

  return { add, get };
});

/**
 * 接入持久化缓存能力的 useRequest
 *
 * @param getKey 缓存的 key，可以传入函数，依据 fetcher 的参数，动态计算出缓存 key
 * @param fetcher 请求函数，可以扩展 promise utils 使用
 * @param options useRequest 的所有参数
 *
 * @returns data - 当前缓存 key 对应的数据
 * @returns mutateKey - 修改当前的缓存 key，切换缓存数据。如果修改后发现目标缓存过期，会重新请求更新缓存
 * @returns refresh - 根据当前的 key（最近一次用过的参数），强制刷新一次缓存
 * @returns updateTime - 上次缓存成功更新的时间
 */
export default function useMemorizedRequest<Data, Params extends Record<string, any>>(
  getKey: string | ((params?: Params) => string),
  fetcher: (params?: Params) => Promise<Data>,
  options: UseRequestOptions<Data, Params> & {
    staleTime?: number
  }
) {
  const { staleTime = 5 * 60 * 1000 } = options ?? {};

  const _initialKey = typeof getKey === "function" ? getKey(options.defaultParams) : getKey;
  const _initialStore = requestStorage.getItem<Data>(_initialKey);
  const data = ref<Data>(_initialStore?.value ?? options.initialData);
  const updateTime = ref(_initialStore?.updateTime ?? 0);
  let previousParams = options.defaultParams;

  const promisePool = usePromisePool();
  const { run, ...restUseRequestReturned } = useRequestNext(
    fetcher, {
      ...options,
      manual: true
    }
  );

  function mutateKey(params: Params) {
    previousParams = params;
    const newKey = typeof getKey === "function" ? getKey(params) : getKey;

    const cached = requestStorage.getItem<Data>(newKey);
    if (cached) {
      data.value = cached.value;
      // 复用还新鲜的缓存
      if ((Date.now() - cached.updateTime) < staleTime) {
        return Promise.resolve(cached.value);
      }
    }

    return revalidate(params);
  }

  function refresh() {
    // TODO: 是否考虑复用 Promise 导致的竞态问题？
    return revalidate(previousParams);
  }

  async function revalidate(params: Params | undefined) {
    const key = typeof getKey === "function" ? getKey(params) : getKey;

    // 复用请求
    const existedPromise = promisePool.get<Data>(key);
    if (existedPromise) {
      console.warn("Reuse promise:", key);
      return existedPromise;
    }

    const promise = run(params);
    promisePool.add(key, promise);
    const res = await promise;
    data.value = res;
    updateTime.value = requestStorage.setItem(key, res);

    return res;
  }

  if (!options.manual) revalidate(options.defaultParams);

  return {
    ...restUseRequestReturned,
    refresh,
    mutateKey,
    updateTime,
    data
  };
}
