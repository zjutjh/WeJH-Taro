import { Option } from "@/constants";
import { OpenTypeEnum } from "../_types";

export const SCHEDULE_OPEN_TYPE_TEXT_RECORD: Partial<Record<OpenTypeEnum, string>> = {
  [OpenTypeEnum.Weekday]: "仅工作日",
  [OpenTypeEnum.Weekend]: "仅节假日",
  [OpenTypeEnum.All]: "正常发车",
  [OpenTypeEnum.Unknown]: ""
}

/** 班次起始点终点「不限」筛选项 */
export const SCHEDULE_DIRECTION_UNLIMITED_OPTION: Option = {
  label: "不限",
  value: ""
}

/** 班次起始点终点名字 固定排序 */
export const PINNED_DIRECTION_OPTION_LABELS = ["朝晖", "屏峰", "莫干山"]