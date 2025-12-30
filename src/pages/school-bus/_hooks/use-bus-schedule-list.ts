import { useQuery } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { first, isEmpty, isNil, last } from "lodash-es";
import { computed, MaybeRef } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

import { OpenTypeEnum, ParsedBusSchedule } from "../_types";
import { parseRouteName } from "../_utils";
import { useBusStaticConfig } from "./use-bus-static-config";

/**
 * 班次信息列表
 */
export const useBusScheduleList = (options?: { search?: MaybeRef<string | undefined> }) => {
  const { search } = options ?? {};
  const { busConfig } = useBusStaticConfig();

  const { data, refetch, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_INFO, search] as const,
    queryFn: ({ queryKey }) => {
      /** 可选字段search */
      const req = queryKey[1] ? { search: queryKey[1] } : {};
      return yxyServiceNext.QueryBusInfo(req);
    }
  });

  /** 班次列表 */
  const parsedScheduleList = computed<ParsedBusSchedule[]>(() => {
    if (isNil(data.value?.list) || isEmpty(data.value.list)) {
      return [];
    }

    const config = busConfig.value || [];

    /**  构建带日期时间的中间数组，用于排序 */
    return data.value.list
      .flatMap((bus) => {
        const { busName, startDirection, endDirection } = parseRouteName(bus.name);
        const staticRoute = config.find((item) => item.name === bus.name);

        if (!bus.bus_time) return [];

        return bus.bus_time.map((schedule) => {
          const hour = dayjs(schedule.departure_time).hour();
          const minute = dayjs(schedule.departure_time).minute();

          const staticTime = staticRoute?.bus_time.find((t) => {
            const [configHour, configMinute] = t.departure_time.split(":").map(Number);
            return configHour === hour && configMinute === minute;
          });

          // TODO: 这里兜底处理可能不准确
          const openType = (staticTime?.open_type as OpenTypeEnum) || OpenTypeEnum.Unknown;

          const item: ParsedBusSchedule = {
            id: `${bus.name}-${schedule.departure_time}`,
            departureTime: dayjs(schedule.departure_time),
            orderedSeats: schedule.ordered_seats,
            remainSeats: schedule.remain_seats,
            busName,
            startDirection,
            endDirection,
            startStation: first(staticRoute?.stations),
            endStation: last(staticRoute?.stations),
            price: bus.price,
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
