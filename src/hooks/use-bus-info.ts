import { useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { computed, MaybeRef, unref } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { BusRouteDetail, FEBusTime, OpenTypeEnum } from "@/types/schoolbus";

/** 班车名称解析工具
 * 输入: "1号线（屏峰-朝晖）"
 * 输出: { routeName: "1号线", start: "屏峰", end: "朝晖" } */
const parseBusName = (name: string) => {
  // 尝试用正则匹配
  const match = name.match(/^(.*?)（(.*?)-(.*?)）$/);
  if (match) {
    return { routeName: match[1], start: match[2], end: match[3] };
  }
  // Fallback: 如果格式不匹配，做一些容错处理或返回空
  return { routeName: name, start: "", end: "" };
};

/** 获取班车信息大表的 Hook
 *  所有范围为"所有线路维度",而非"某条线路维度" 的信息在useBusInfo中获取
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

  /** 将原大表flat化得到的"所有班次列表"
   *  用于渲染校车首页班次列表 */
  const busTimeList = computed<FEBusTime[]>(() => {
    if (!data.value?.list) return [];

    const now = dayjs();

    /**  构建带日期时间的中间数组，用于排序 */
    const items = data.value.list.flatMap((bus) => {
      const { routeName, start, end } = parseBusName(bus.name);

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

  /** 校车线路信息 */
  const busRouteList = computed<BusRouteDetail[]>(() => {
    if (!data.value?.list) return [];
    return data.value.list.map((bus) => {
      const { routeName, start, end } = parseBusName(bus.name);

      return {
        routeName,
        start,
        end,
        stations: bus.stations.map((s) => ({ stationName: s }))
      };
    });
  });

  /** 根据校区分类的线路名列表 */
  const busLineList = computed(() => {
    const groups = {
      "朝晖-屏峰": new Set<string>(),
      "朝晖-莫干山": new Set<string>(),
      "屏峰-莫干山": new Set<string>()
    };

    if (!data.value?.list) {
      return {
        "朝晖-屏峰": [],
        "朝晖-莫干山": [],
        "屏峰-莫干山": []
      };
    }

    data.value.list.forEach((bus) => {
      const { routeName, start, end } = parseBusName(bus.name);
      const campuses = new Set([start, end]);

      if (campuses.has("朝晖") && campuses.has("屏峰")) {
        groups["朝晖-屏峰"].add(routeName);
      } else if (campuses.has("朝晖") && campuses.has("莫干山")) {
        groups["朝晖-莫干山"].add(routeName);
      } else if (campuses.has("屏峰") && campuses.has("莫干山")) {
        groups["屏峰-莫干山"].add(routeName);
      }
    });

    return {
      "朝晖-屏峰": Array.from(groups["朝晖-屏峰"]),
      "朝晖-莫干山": Array.from(groups["朝晖-莫干山"]),
      "屏峰-莫干山": Array.from(groups["屏峰-莫干山"])
    };
  });

  return {
    busTimeList,
    busRouteList: busRouteList,
    busLineList: busLineList,
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
  const { busRouteList: busRoutes, isLoading, refetch } = useBusInfo();

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
