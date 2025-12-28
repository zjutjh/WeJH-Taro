import { OpenTypeEnum } from "../_types";

export const SCHEDULE_OPEN_TYPE_TEXT_RECORD: Partial<Record<OpenTypeEnum, string>> = {
  [OpenTypeEnum.Weekday]: "仅工作日",
  [OpenTypeEnum.Weekend]: "仅节假日",
  [OpenTypeEnum.All]: "正常发车",
  [OpenTypeEnum.Unknown]: ""
}