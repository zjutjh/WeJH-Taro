import { useQuery } from "@tanstack/vue-query";
import { computed, MaybeRef } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { FEBusTime, OpenTypeEnum } from "@/types/schoolbus";

export const useBusInfo = (search: MaybeRef<string | undefined>) => {
  const { data, refetch } = useQuery({
    queryKey: [QUERY_KEY.SCHOOLBUS_INFO, search] as const,
    /** 可选字段search */
    queryFn: ({ queryKey }) => {
      const req = queryKey[1] ? { search: queryKey[1] } : {};
      return yxyServiceNext.QueryBusInfo(req);
    }
  });

  /** 校车首页班次卡片使用的字段 */
  const busTimeList = computed<FEBusTime[]>(() => {
    if (!data.value?.list) return [];
    return data.value.list.flatMap((bus) => {
      /** name形如 朝晖-屏峰, 进行拆解 得到start和end字段 */
      const start = bus.name.split("-")[0] ?? "";
      const end = bus.name.split("-")[1] ?? "";
      return bus.bus_time.map((time) => ({
        departureTime: time.departure_time,
        orderedSeats: time.ordered_seats,
        remainSeats: time.remain_seats,
        /** 暂时先为All, 等待自定义接口里的数据 */
        openType: OpenTypeEnum.All,
        routeName: bus.name,
        start,
        end,
        /** 后端传来的如400表示的是4.00元 */
        price: bus.price / 100
      }));
    });
  });

  return {
    busInfo: computed(() => data.value?.list),
    busTimeList: busTimeList,
    refetch
  };
};
