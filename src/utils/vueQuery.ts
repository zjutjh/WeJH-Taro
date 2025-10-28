import { QueryClient, QueryClientConfig } from "@tanstack/vue-query";

const OneMinute = 60 * 1000;

const globalQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * OneMinute
    }
  }
};

export const globalQueryClient = new QueryClient(globalQueryClientConfig);
