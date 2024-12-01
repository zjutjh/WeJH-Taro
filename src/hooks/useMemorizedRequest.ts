import { useRequestNext } from "./useRequest";
import { persistedStorage } from "@/utils";
import { defineStore } from "pinia";
import { onMounted, Ref, ref } from "vue";

const keyPrefix = "__request";

/**
 * 处理 key，提取其中的第一部分，并加上前缀作为 Domain，其余部分作为 Path。
 *
 * @param key 用户传入的 Key
 * @returns 解析后的结果，Domain 是持久化存储的 Key，Path 是存储数据对象中的 Key。
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
 * 利用 wx 特性，没有序列化数据对象成字符串，而是直接存入对象，减少序列化性能消耗
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
    return map.get(key) as Promise<Data> | undefined;
  }

  return { add, get };
});

type useMemorizedRequestOptions<Data, Params> = {
  /** Promise 还未 fulfilled 时，给 `data` 的初始值 */
  initialData: Data;
  /** 自动触发请求，以及调用 `run` 函数不传参数时，默认给请求函数传入的参数 */
  defaultParams?: Params;
  /** 是否在组件初始化的时候触发 revalidate */
  revalidateOnMount?: boolean;
  /** 缓存的保鲜时间，默认 1 分钟，当前时间和写入时间之间的间隔大于保鲜时间，判断缓存过期 */
  staleTime?: number;
  onSuccess?: (data: Data, params: Params | undefined) => void;
  onError?: (error: unknown) => void;
};

export type Key = `${string}/${string}`;

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
  getKey: Key | ((params?: Params) => Key),
  fetcher: (params?: Params) => Promise<Data>,
  options: useMemorizedRequestOptions<Data, Params>
) {
  const {
    staleTime = 1 * 1000,
    revalidateOnMount = true
  } = options ?? {};

  const _initialKey = typeof getKey === "function" ? getKey(options.defaultParams) : getKey;
  const _initialStore = requestStorage.getItem<Data>(_initialKey);
  const data = ref(_initialStore?.value ?? options.initialData) as Ref<Data>;
  const updateTime = ref(_initialStore?.updateTime ?? 0);
  let previousParams = options.defaultParams;

  const promisePool = usePromisePool();
  const { run, error, loading } = useRequestNext(
    fetcher, {
      manual: true,
      resetOnRun: false,
      initialData: options.initialData,
      defaultParams: options.defaultParams,
      onError: options.onError,
      onSuccess: options.onSuccess
    }
  );

  function mutateKey(params?: Params) {
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

    return _revalidate(params);
  }

  function refresh() {
    // TODO: 是否考虑复用 Promise 导致的竞态问题？
    return _revalidate(previousParams);
  }

  async function _revalidate(params: Params | undefined) {
    const key = typeof getKey === "function" ? getKey(params) : getKey;

    // 复用请求 Promise
    const existedPromise = promisePool.get<Data>(key);
    if (existedPromise) console.warn("Reuse promise:", key);

    const promise = existedPromise ?? run(params);
    if (!existedPromise) promisePool.add(key, promise);
    const res = await promise;
    data.value = res!;

    // 复用 Promise 时，不需要再写入到缓存
    if (!existedPromise) {
      updateTime.value = requestStorage.setItem(key, res);
    }

    return res;
  }

  onMounted(() => {
    if (revalidateOnMount)
      mutateKey(options.defaultParams);
  });

  return {
    loading,
    error,
    data,
    refresh,
    mutateKey,
    updateTime
  };
}
