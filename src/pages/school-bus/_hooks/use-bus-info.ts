import { useQuery } from "@tanstack/vue-query";
import { computed, MaybeRef, unref } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";
import { isPFCampus } from "@/utils/school-bus";

import { BusRouteDetail } from "../_types";
import { parseBusName } from "../_utils";
import { useBusScheduleList } from "./use-bus-schedule-list";

/** 获取班车配置信息的 Hook (实际上是获取一个静态的json文件) */
export const useBusConfig = () => {
  const { data: busConfig, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_CONFIG] as const,
    queryFn: () => yxyServiceNext.QueryBusConfig()
  });

  return { busConfig, isLoading };
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
