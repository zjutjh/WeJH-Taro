import { useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { computed, MaybeRef, unref } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { BusRouteDetail, FEBusTime, OpenTypeEnum } from "@/types/schoolbus";

/** 获取班车信息大表的 Hook
 *  为以下useBusDetail和useBusRoute等其余接口提供数据支持
 *  @param options 可选参数 包括search
 */
export const useBusInfo = (options?: { search?: MaybeRef<string | undefined> }) => {
  const { search } = options ?? {};
  const { data, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOLBUS_INFO, search] as const,
    queryFn: ({ queryKey }) => {
      /** 可选字段search */
      const req = queryKey[1] ? { search: queryKey[1] } : {};
      return yxyServiceNext.QueryBusInfo(req);
    }
  });

  /** 校车线路信息 */
  const busRoutes = computed<BusRouteDetail[]>(() => {
    if (!data.value?.list) return [];
    return data.value.list.map((bus) => {
      /** 此处bus.name形如: 1号线（屏峰-朝晖）*/
      let [start, end] = bus.name.split("-");
      start = start.split("（")[1];
      end = end.split("）")[0];
      const routeName = bus.name.split("（")[0];

      return {
        routeName,
        start,
        end,
        stations: bus.stations.map((s) => ({ stationName: s }))
      };
    });
  });

  /** 校车首页班次卡片使用的字段 */
  const busTimeList = computed<FEBusTime[]>(() => {
    if (!data.value?.list) return [];

    const now = dayjs();

    /**  构建带日期时间的中间数组，用于排序 */
    const items = data.value.list.flatMap((bus) => {
      /** 此处bus.name形如: 1号线（屏峰-朝晖）*/
      let [start, end] = bus.name.split("-");
      start = start.split("（")[1];
      end = end.split("）")[0];
      const routeName = bus.name.split("（")[0];

      return bus.bus_time.map((time) => {
        const [hourStr, minuteStr] = time.departure_time.split(":");
        const hour = Number(hourStr);
        const minute = Number(minuteStr);

        // 构造今天的该时间点
        let date = dayjs().hour(hour).minute(minute).second(0).millisecond(0);

        // 如果该时间点早于当前时刻，则视为第二天的班次
        if (date.isBefore(now)) date = date.add(1, "day");

        const item: FEBusTime = {
          departureTime: date.format("MM.DD HH:mm"),
          orderedSeats: time.ordered_seats,
          remainSeats: time.remain_seats,
          /** 暂时用all, 等待接后端的自定义接口, 来判断openType */
          openType: OpenTypeEnum.All,
          routeName: routeName,
          start: start,
          end: end,
          price: bus.price / 100
        };

        return { item, date: date };
      });
    });

    // 按真实日期时间升序排序
    items.sort((a, b) => a.date.valueOf() - b.date.valueOf());

    return items.map((x) => x.item);
  });

  return {
    busTimeList,
    busRoutes,
    refetch,
    isLoading
  };
};

/**
 * 获取某个班车详情的 Hook
 * @param matcher 匹配条件
 */
export const useBusDetail = (
  matcher: MaybeRef<{
    routeName: string;
    start: string;
    end: string;
  }>
) => {
  const { busTimeList, isLoading, refetch } = useBusInfo();

  const busDetail = computed(() => {
    const m = unref(matcher);

    return busTimeList.value.filter(
      (item) => item.routeName === m.routeName && item.start === m.start && item.end === m.end
    );
  });

  return {
    busDetail,
    isLoading,
    refetch
  };
};

/**
 * 获取某条线路详情的 Hook
 * @param matcher 匹配条件
 */
export const useBusRoute = (
  matcher: MaybeRef<{
    routeName: string;
    start: string;
    end: string;
  }>
) => {
  const { busRoutes, isLoading, refetch } = useBusInfo();

  const route = computed(() => {
    const m = unref(matcher);
    return busRoutes.value.find(
      (item) => item.routeName === m.routeName && item.start === m.start && item.end === m.end
    );
  });

  return {
    route,
    isLoading,
    refetch
  };
};
