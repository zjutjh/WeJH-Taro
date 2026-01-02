import { useQuery } from "@tanstack/vue-query";
import { refDebounced } from "@vueuse/core";
import dayjs from "dayjs";
import { get, isEmpty, isNil } from "lodash-es";
import { computed, ComputedRef, MaybeRef, Ref, toRef, unref } from "vue";

import { yxyServiceNext } from "@/services";
import { QUERY_KEY } from "@/services/api/query-key";

import { QuickFilterItem } from "../_components/filter-quick-field/constants";
import { SCHEDULE_DIRECTION_UNLIMITED_OPTION, SCHEDULE_KEYWORDS_MATCH_RULES } from "../_constants";
import { OpenTypeEnum, ParsedBusSchedule } from "../_types";
import { parseRouteName } from "../_utils";
import { useBusStaticConfig } from "./use-bus-static-config";

/** 接口全量搜索时的关键词 */
const SEARCH_ALL_KEYWORDS = "";

interface BusScheduleListParams {
  /** 搜索关键词 */
  keywords: MaybeRef<string>;
  /** 起始方向 */
  startDirection: MaybeRef<string>;
  /** 终止方向 */
  endDirection: MaybeRef<string>;
  /** 快速筛选 */
  activeQuickFilter: MaybeRef<QuickFilterItem[]>;
}

interface BusScheduleListReturns {
  /** 全量的班次列表 */
  fullScheduleList: ComputedRef<ParsedBusSchedule[]>;
  /** 筛选后的班次列表 */
  filteredScheduleList: ComputedRef<ParsedBusSchedule[]>;
  /** 是否正在加载 */
  isLoading: Ref<boolean>;
  /** 更新时间 */
  updateAt: ComputedRef<string>;
}

/**
 * 班次信息列表
 *
 * 所有筛选项/搜索词都由前端做筛选，后端只提供全量数据
 */
export const useBusScheduleList = ({
  keywords,
  startDirection,
  endDirection,
  activeQuickFilter
}: BusScheduleListParams): BusScheduleListReturns => {
  const { busConfig } = useBusStaticConfig();
  const debouncedKeywords = refDebounced(toRef(keywords), 500);
  const proceedKeywords = computed(() => {
    return unref(debouncedKeywords).replace(/\s+/g, "");
  });

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.SCHOOL_BUS_SCHEDULE_LIST] as const,
    queryFn: () => {
      return yxyServiceNext.QueryBusInfo({ search: SEARCH_ALL_KEYWORDS });
    }
  });

  const updateAt = computed(() => {
    return dayjs(data.value?.updated_at).format("YYYY-MM-DD HH:mm:ss");
  });

  /** 全量的班次列表 */
  const fullScheduleList = computed<ParsedBusSchedule[]>(() => {
    if (isNil(data.value?.list) || isEmpty(data.value.list)) {
      return [];
    }

    const config = busConfig.value || [];

    /**  构建带日期时间的中间数组，用于排序 */
    return data.value.list
      .flatMap((bus) => {
        const {
          busName,
          startDirection: _startDirection,
          endDirection: _endDirection
        } = parseRouteName(bus.name);
        const staticRoute = config.find((item) => item.name === bus.name);

        if (!bus.bus_time) return [];

        return bus.bus_time.map((schedule) => {
          const hour = dayjs(schedule.departure_time).hour();
          const minute = dayjs(schedule.departure_time).minute();

          const staticTime = staticRoute?.bus_time.find((t) => {
            const [configHour, configMinute] = t.departure_time.split(":").map(Number);
            return configHour === hour && configMinute === minute;
          });

          // 如果静态配置中没有配这条线路，给兜底态
          const openType = get(staticTime, "open_type", OpenTypeEnum.Unknown) as OpenTypeEnum;

          const item: ParsedBusSchedule = {
            id: `${bus.name}-${schedule.departure_time}`,
            departureTime: dayjs(schedule.departure_time),
            orderedSeats: schedule.ordered_seats,
            remainSeats: schedule.remain_seats,
            busName,
            startDirection: _startDirection,
            endDirection: _endDirection,
            stationList: staticRoute?.stations,
            price: bus.price,
            openType
          };

          return item;
        });
      })
      .sort((a, b) => (a.departureTime.isAfter(b.departureTime) ? 1 : -1));
  });

  /**
   * 按各种筛选条件筛选过的班次列表
   */
  const filteredScheduleList = computed(() => {
    // 先按方向筛选一遍
    let filtered = fullScheduleList.value.filter((item) => {
      const matchStart =
        unref(startDirection) === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value ||
        item.startDirection === unref(startDirection);

      const matchEnd =
        unref(endDirection) === SCHEDULE_DIRECTION_UNLIMITED_OPTION.value ||
        item.endDirection === unref(endDirection);

      return matchStart && matchEnd;
    });

    // 按快筛项筛选，先筛交集，再筛并集
    const intersectionFilters = unref(activeQuickFilter).filter((f) => f.type === "intersection");
    const unionFilters = unref(activeQuickFilter).filter((f) => f.type === "union");

    // "Intersection" filters: AND logic
    intersectionFilters.forEach((f) => {
      filtered = f.filter(filtered);
    });

    // "Union" filters: OR logic
    if (!isEmpty(unionFilters)) {
      const unionFilteredResults = new Set<string>();
      unionFilters.forEach((f) => {
        const matches = f.filter(filtered);
        matches.forEach((m) => unionFilteredResults.add(m.id));
      });

      filtered = filtered.filter((item) => unionFilteredResults.has(item.id));
    }

    if (isEmpty(proceedKeywords.value)) {
      return filtered;
    }

    // 按搜索词筛选
    const filteredByKeywords: ParsedBusSchedule[] = [];

    for (const schedule of filtered) {
      for (const rule of SCHEDULE_KEYWORDS_MATCH_RULES) {
        const matchValue = rule.match(schedule[rule.key], proceedKeywords.value);

        if (!matchValue) {
          continue;
        }

        filteredByKeywords.push({
          ...schedule,
          matchReason: {
            matchProperty: rule.propertyName,
            matchValue
          }
        });
        break;
      }
    }

    return filteredByKeywords;
  });

  return {
    fullScheduleList,
    filteredScheduleList,
    isLoading,
    updateAt
  };
};
