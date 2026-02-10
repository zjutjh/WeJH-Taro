import { experimental_createQueryPersister as createQueryPersister } from "@tanstack/query-persist-client-core";
import { QueryCache, QueryClient, QueryClientConfig } from "@tanstack/vue-query";
import Taro from "@tarojs/taro";

import { persistedStorage } from "./storage";

const ONE_SECOND = 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

const globalQueryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    // TODO: 上报接口错误
    onError: (err) => Taro.showToast({ title: err.message, icon: "none" })
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      meta: { persist: true },
      staleTime: 30 * ONE_SECOND,
      persister: createQueryPersister({
        storage: persistedStorage,
        maxAge: ONE_DAY,
        filters: { predicate: (query) => Boolean(query.meta?.persist) }
      }).persisterFn
    }
  }
};

export const globalQueryClient = new QueryClient(globalQueryClientConfig);
