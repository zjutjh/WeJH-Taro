import { useQuery } from "@tanstack/vue-query";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

/** 获取班车配置信息的 Hook (实际上是获取一个静态的json文件) */
export const useBusStaticConfig = () => {
  const { data: busConfig, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_STATIC_CONFIG] as const,
    queryFn: () => yxyServiceNext.QueryBusConfig()
  });

  return { busConfig, isLoading };
};
