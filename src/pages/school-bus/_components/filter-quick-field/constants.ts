import dayjs from "dayjs";
import { isEmpty } from "lodash-es";

import { ParsedBusSchedule } from "../../_types";
import { filterByTimeRange, isDirectLine, isWithinFuture24h } from "./utils";

export interface QuickFilterItem {
  id: string;
  label: string;
  type: "intersection" | "union";
  filter: (list: ParsedBusSchedule[]) => ParsedBusSchedule[];
  shouldHide?: (list: ParsedBusSchedule[]) => boolean;
}

export const QUICK_FILTER_ITEMS: QuickFilterItem[] = [
  {
    id: "direct",
    label: "直达线",
    type: "intersection",
    filter: (list) => list.filter(isDirectLine)
  },
  {
    id: "today_early",
    label: "今天凌晨",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().startOf("day");
      const endTime = startTime.add(6, "hour");
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: (list) => {
      const startTime = dayjs().startOf("day");
      const endTime = startTime.add(6, "hour");
      return (
        !isWithinFuture24h(startTime, endTime) ||
        // 凌晨目前数据没有班次，大部分时候不展示，如果偶现有数据则展示
        isEmpty(filterByTimeRange(list, startTime, endTime))
      );
    }
  },
  {
    id: "today_morning",
    label: "今天上午",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().startOf("day").add(6, "hour");
      const endTime = startTime.add(6, "hour"); // 12:00
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().startOf("day").add(6, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  },
  {
    id: "today_afternoon",
    label: "今天下午",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().startOf("day").add(12, "hour");
      const endTime = startTime.add(6, "hour"); // 18:00
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().startOf("day").add(12, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  },
  {
    id: "today_evening",
    label: "今天晚上",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().startOf("day").add(18, "hour");
      const endTime = startTime.add(6, "hour"); // 24:00 (next day 00:00)
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().startOf("day").add(18, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  },
  {
    id: "tomorrow_early",
    label: "明天凌晨",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().add(1, "day").startOf("day");
      const endTime = startTime.add(6, "hour");
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: (list) => {
      const startTime = dayjs().add(1, "day").startOf("day");
      const endTime = startTime.add(6, "hour");
      return (
        !isWithinFuture24h(startTime, endTime) ||
        // 凌晨目前数据没有班次，大部分时候不展示，如果偶现有数据则展示
        isEmpty(filterByTimeRange(list, startTime, endTime))
      );
    }
  },
  {
    id: "tomorrow_morning",
    label: "明天上午",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().add(1, "day").startOf("day").add(6, "hour");
      const endTime = startTime.add(6, "hour");
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().add(1, "day").startOf("day").add(6, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  },
  {
    id: "tomorrow_afternoon",
    label: "明天下午",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().add(1, "day").startOf("day").add(12, "hour");
      const endTime = startTime.add(6, "hour");
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().add(1, "day").startOf("day").add(12, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  },
  {
    id: "tomorrow_evening",
    label: "明天晚上",
    type: "union",
    filter: (list) => {
      const startTime = dayjs().add(1, "day").startOf("day").add(18, "hour");
      const endTime = startTime.add(6, "hour");
      return filterByTimeRange(list, startTime, endTime);
    },
    shouldHide: () => {
      const startTime = dayjs().add(1, "day").startOf("day").add(18, "hour");
      const endTime = startTime.add(6, "hour");
      return !isWithinFuture24h(startTime, endTime);
    }
  }
];
