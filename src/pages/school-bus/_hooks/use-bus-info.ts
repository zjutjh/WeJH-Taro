import { useQuery } from "@tanstack/vue-query";
import { groupBy } from "lodash-es";
import { computed } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

import { parseRouteName } from "../_utils";

// TODO: 文件名修改
/** 获取班车配置信息的 Hook (实际上是获取一个静态的json文件) */
export const useBusConfig = () => {
  const { data: busConfig, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_CONFIG] as const,
    queryFn: () => yxyServiceNext.QueryBusConfig()
  });

  return { busConfig, isLoading };
};

/** 根据校区分类的线路名列表 Hook */
export const useBusNameGroup = () => {
  const { busConfig, isLoading } = useBusConfig();

  const group = computed(() => {
    return groupBy(busConfig.value, (item) => {
      const { start, end } = parseRouteName(item.name);
      return [start, end].sort().join("-");
    });
  });

  return { group, isLoading };
};
