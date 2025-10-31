import { experimental_createQueryPersister as createQueryPersister } from "@tanstack/query-persist-client-core";
import { QueryClient, QueryClientConfig } from "@tanstack/vue-query";

import { persistedStorage } from "./storage";

const OneMinute = 60 * 1000;
const OneDay = 24 * 60 * 60 * 1000;

const globalQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 2,
      meta: {
        persist: true
      },
      staleTime: 5 * OneMinute,
      persister: createQueryPersister({
        storage: persistedStorage,
        maxAge: 7 * OneDay,
        filters: {
          predicate: (query) => Boolean(query.meta?.persist)
        }
      }).persisterFn
    }
  }
};

export const globalQueryClient = new QueryClient(globalQueryClientConfig);
