import { QueryCache, VueQueryPluginOptions } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";
import { experimental_createPersister as createPersister } from "@tanstack/query-persist-client-core";
import { persistedStorage } from "./storage";

export function createVueQueryPluginOptions(): VueQueryPluginOptions {
  const OneMinute = 60 * 1000;
  const OneDay = 24 * 60 * 60 * 1000;

  return {
    queryClientConfig: {
      queryCache: new QueryCache({
        onError: (err) => Taro.showToast({ title: err.message, icon: "none" })
      }),
      defaultOptions: {
        queries: {
          meta: {
            // 默认启用持久化缓存
            persist: true
          },
          // 缓存生效时间 5 min
          staleTime: 5 * OneMinute,
          persister: createPersister({
            prefix: "vue-query",
            storage: persistedStorage,
            // 持久化缓存生效 7 天
            maxAge: 7 * OneDay,
            filters: {
              predicate: (query) => Boolean(query.meta?.persist)
            }
          })
        }
      }
    }
  };
}
