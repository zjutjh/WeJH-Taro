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
  // 时长短于1分钟时显示"几秒"
  if (duration.asMinutes() < 1) {
    return "几秒";
  }

  return humanizeDuration(duration.asMilliseconds(), {
    language: "zh_CN",
    // 去除小数
    maxDecimalPoints: 0,
    // 单位分隔符
    delimiter: " ",
    // 忽略"周"单位
    units: ["y", "mo", "d", "h", "m", "s"],
    ...options
  });
};
