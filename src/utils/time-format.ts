import dayjs, { ConfigType as DayjsConfigType } from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";
import humanizeDuration from "humanize-duration";

/** 计算时间是周几，返回单个汉字 */
export const getWeekday = (time: DayjsConfigType) => {
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"] as const;
  return dayChars[dayjs(time).day()];
};

/** 格式化Dayjs Duration为文本，为0的单位不显示 */
export const formatDuration = (
  duration: dayjsDuration.Duration,
  options: humanizeDuration.Options = {}
) => {
  return humanizeDuration(duration.asMilliseconds(), {
    language: "zh_CN",
    maxDecimalPoints: 0,
    delimiter: " ",
    units: ["y", "mo", "d", "h", "m", "s"],
    ...options
  });
};
