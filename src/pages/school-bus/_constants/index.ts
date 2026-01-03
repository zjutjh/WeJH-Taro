import { Option } from "@/constants";

import { OpenTypeEnum, ParsedBusSchedule } from "../_types";

export const SCHEDULE_OPEN_TYPE_TEXT_RECORD: Partial<Record<OpenTypeEnum, string>> = {
  [OpenTypeEnum.Weekday]: "仅工作日",
  [OpenTypeEnum.Weekend]: "仅节假日",
  [OpenTypeEnum.All]: "正常发车",
  [OpenTypeEnum.Unknown]: ""
};

/** 班次起始点终点「不限方向」筛选项 */
export const SCHEDULE_DIRECTION_UNLIMITED_OPTION: Option = {
  label: "不限方向",
  value: ""
};

/** 班次起始点终点名字 固定排序 */
export const PINNED_DIRECTION_OPTION_LABELS = ["朝晖", "屏峰", "莫干山"];

export interface ScheduleKeywordMatchRule<P extends keyof ParsedBusSchedule> {
  key: P;
  propertyName: string;
  match: (value: ParsedBusSchedule[P], keywords: string) => string | undefined;
}

/**
 * 关键词匹配班次的规则
 */
export const SCHEDULE_KEYWORDS_MATCH_RULES: ScheduleKeywordMatchRule<keyof ParsedBusSchedule>[] = [
  {
    key: "busName",
    propertyName: "班车名称",
    match: (value: string, keywords) => (value.includes(keywords) ? value : undefined)
  },
  {
    key: "startDirection",
    propertyName: "起始方向",
    match: (value: string, keywords) => (value.includes(keywords) ? value : undefined)
  },
  {
    key: "endDirection",
    propertyName: "终止方向",
    match: (value: string, keywords) => (value.includes(keywords) ? value : undefined)
  },
  {
    key: "stationList",
    propertyName: "途经站点",
    match: (value: string[], keywords) => {
      const matched = value.find((s) => s.includes(keywords));
      return matched ? matched : undefined;
    }
  },
  {
    key: "openType",
    propertyName: "发车情况",
    match: (value: OpenTypeEnum, keywords) =>
      SCHEDULE_OPEN_TYPE_TEXT_RECORD[value]?.includes(keywords)
        ? SCHEDULE_OPEN_TYPE_TEXT_RECORD[value]
        : undefined
  }
];
