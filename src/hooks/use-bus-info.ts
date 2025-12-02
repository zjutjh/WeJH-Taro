import { useQuery } from "@tanstack/vue-query";
import { computed, MaybeRef } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

export const useBusInfo = (userId: MaybeRef<number | null> = null) => {
  const { data, refetch } = useQuery({
    queryKey: [QUERY_KEY.SCHOOLBUS_INFO] as const,
    queryFn: ({ queryKey }) =>
      yxyServiceNext.QueryBusInfo({
        search: undefined
      })
  });
  const userInfo = computed(() => data.value || INITIAL_USER_INFO);

  return {
    userInfo: userInfoReactive,
    refetch
  };
};
