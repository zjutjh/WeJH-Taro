import { Option } from "@/constants";

import { OpenTypeEnum, ParsedBusSchedule } from "../_types";

export const SCHEDULE_OPEN_TYPE_TEXT_RECORD: Record<OpenTypeEnum, string> = {
  [OpenTypeEnum.Weekday]: "工作日",
  [OpenTypeEnum.Weekend]: "周末",
  [OpenTypeEnum.Holiday]: "法定节假日"
};

export const SCHEDULE_OPEN_TYPE_OPTIONS: OpenTypeEnum[] = [
  OpenTypeEnum.Weekday,
  OpenTypeEnum.Weekend,
  OpenTypeEnum.Holiday
];

export const normalizeScheduleOpenTypeList = (
  openTypeList?: Array<OpenTypeEnum | string>
): OpenTypeEnum[] => {
  if (!openTypeList || openTypeList.length === 0) {
    return [];
  }

  return SCHEDULE_OPEN_TYPE_OPTIONS.filter((openType) => openTypeList.includes(openType));
};

export const formatScheduleOpenTypeText = (openTypeList?: OpenTypeEnum[]) => {
  const normalizedOpenTypeList = normalizeScheduleOpenTypeList(openTypeList);

  if (normalizedOpenTypeList.length === 0) {
    return "";
  }

  return SCHEDULE_OPEN_TYPE_OPTIONS.filter((openType) => normalizedOpenTypeList.includes(openType))
    .map((openType) => SCHEDULE_OPEN_TYPE_TEXT_RECORD[openType])
    .join("/");
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
    match: (value: OpenTypeEnum[] | undefined, keywords) => {
      const normalizedOpenTypeList = normalizeScheduleOpenTypeList(value);

      if (normalizedOpenTypeList.length === 0) {
        return undefined;
      }

      const matched = normalizedOpenTypeList.find((openType) => {
        return SCHEDULE_OPEN_TYPE_TEXT_RECORD[openType].includes(keywords);
      });

      return matched ? SCHEDULE_OPEN_TYPE_TEXT_RECORD[matched] : undefined;
    }
  }
];
