import { QueryCache, QueryClient, QueryClientConfig } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { experimental_createPersister as createPersister } from "@tanstack/query-persist-client-core";
import { persistedStorage } from "./storage";

const OneMinute = 60 * 1000;
const OneDay = 24 * 60 * 60 * 1000;

export const globalQueryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (err) => Taro.showToast({ title: err.message, icon: "none" })
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      meta: {
        // 默认启用持久化缓存
        persist: true
      },
      // 缓存生效时间
      staleTime: 5 * OneMinute,
      persister: createPersister({
        prefix: "vq",
        storage: persistedStorage,
        // 持久化缓存生效时间
        maxAge: 7 * OneDay,
        filters: {
          predicate: (query) => Boolean(query.meta?.persist)
        }
      })
    }
  }
};

export const globalQueryClient = new QueryClient(globalQueryClientConfig);
