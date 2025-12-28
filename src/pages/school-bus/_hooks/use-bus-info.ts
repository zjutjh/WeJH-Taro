import { useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { isEmpty, isNil } from "lodash-es";
import { computed, MaybeRef, unref } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { isPFCampus } from "@/utils/school-bus";

import { BusRouteDetail, OpenTypeEnum, ParsedBusSchedule } from "../_types";
import { parseBusName } from "../_utils";

/** 获取班车配置信息的 Hook (实际上是获取一个静态的json文件) */
export const useBusConfig = () => {
  const { data: busConfig, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_CONFIG] as const,
    queryFn: () => yxyServiceNext.QueryBusConfig(),
    staleTime: Infinity
  });

  return { busConfig, isLoading };
};

/**
 * 班次信息列表
 */
export const useBusScheduleList = (options?: { search?: MaybeRef<string | undefined> }) => {
  const { search } = options ?? {};
  const { busConfig } = useBusConfig();

  const { data, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_INFO, search] as const,
    queryFn: ({ queryKey }) => {
      /** 可选字段search */
      const req = queryKey[1] ? { search: queryKey[1] } : {};
      return yxyServiceNext.QueryBusInfo(req);
    }
  });

  /** 将原大表flat化得到的"所有班次列表"
   *  用于渲染校车首页班次列表 */
  const parsedScheduleList = computed<ParsedBusSchedule[]>(() => {
    if (isNil(data.value?.list) || isEmpty(data.value.list)) {
      return [];
    }

    const config = busConfig.value || [];

    /**  构建带日期时间的中间数组，用于排序 */
    return data.value.list
      .flatMap((bus) => {
        const { routeName, start, end } = parseBusName(bus.name);
        const staticRoute = config.find((item) => item.name === bus.name);

        if (!bus.bus_time) return [];

        return bus.bus_time.map((schedule) => {
          const hourStr = dayjs(schedule.departure_time).hour();
          const minuteStr = dayjs(schedule.departure_time).minute();

          const staticTime = staticRoute?.bus_time.find((t) =>
            t.departure_time.startsWith(`${hourStr}:${minuteStr}`)
          );

          // TODO: 这里兜底处理可能不准确
          const openType = (staticTime?.open_type as OpenTypeEnum) || OpenTypeEnum.Unknown;

          const item: ParsedBusSchedule = {
            id: `${bus.name}-${schedule.departure_time}`,
            departureTime: dayjs(schedule.departure_time),
            orderedSeats: schedule.ordered_seats,
            remainSeats: schedule.remain_seats,
            routeName,
            start,
            end,
            // TODO: 这里单位转换可能有问题
            price: bus.price / 100,
            openType
          };

          return item;
        });
      })
      .sort((a, b) => (a.departureTime.isAfter(b.departureTime) ? 1 : -1));
  });

  return {
    parsedScheduleList,
    refetch,
    isLoading
  };
};

/** 校车线路信息 Hook */
export const useBusRouteList = () => {
  const { busConfig, isLoading } = useBusConfig();

  const busRouteList = computed<BusRouteDetail[]>(() => {
    const config = busConfig.value || [];
    return config.map((bus) => {
      const { routeName, start, end } = parseBusName(bus.name);

      return {
        routeName,
        start,
        end,
        stations: bus.stations.map((s) => ({ stationName: s }))
      };
    });
  });

  return { busRouteList, isLoading };
};

/** 根据校区分类的线路名列表 Hook */
export const useBusLineList = () => {
  const { busConfig, isLoading } = useBusConfig();

  const busLineList = computed(() => {
    const config = busConfig.value || [];
    console.log("* config *", { config });

    const groups = {
      "朝晖-屏峰": new Set<string>(),
      "朝晖-莫干山": new Set<string>(),
      "屏峰-莫干山": new Set<string>(),
      "": new Set<string>()
    };

    config.forEach((bus) => {
      const { routeName, start, end } = parseBusName(bus.name);
      const campuses = new Set([start, end]);

      const hasPF = isPFCampus(start) || isPFCampus(end);
      if (campuses.has("朝晖") && hasPF) {
        groups["朝晖-屏峰"].add(routeName);
      } else if (campuses.has("朝晖") && campuses.has("莫干山")) {
        groups["朝晖-莫干山"].add(routeName);
      } else if (hasPF && campuses.has("莫干山")) {
        groups["屏峰-莫干山"].add(routeName);
      } else {
        groups[""].add(routeName);
      }
    });

    return {
      "朝晖-屏峰": Array.from(groups["朝晖-屏峰"]),
      "朝晖-莫干山": Array.from(groups["朝晖-莫干山"]),
      "屏峰-莫干山": Array.from(groups["屏峰-莫干山"]),
      "": Array.from(groups[""])
    };
  });

  return { busLineList, isLoading };
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
  const { parsedScheduleList: busTimeList, isLoading, refetch } = useBusScheduleList();

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
  const { busRouteList: busRoutes } = useBusRouteList();
  const { isLoading, refetch } = useBusScheduleList();

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
