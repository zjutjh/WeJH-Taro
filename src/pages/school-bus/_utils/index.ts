import dayjs, { Dayjs } from "dayjs";

/**
 * 班车名称解析
 *
 * @param raw 班车名称 e.g. `1号线（屏峰-朝晖）`
 */
export const parseBusName = (raw: string) => {
  const match = raw.match(/^(.*?)（(.*?)-(.*?)）$/);
  if (match) {
    return { routeName: match[1], start: match[2], end: match[3] };
  }

  // 处理格式不匹配
  return { routeName: raw, start: "", end: "" };
};

/**
 * 格式化相对日期
 * 输入一个 dayjs，输出「今天下午 8:00」这类的字符串
 * 如果时间大于「明天晚上」，就直接展示日期
 */
export const formatRelativeDayPeriod = (date: Dayjs) => {
  const now = dayjs();
  const hour = date.hour();

  const getPeriod = (h: number) => {
    if (h < 6) return "凌晨";
    if (h < 12) return "上午";
    if (h < 18) return "下午";
    return "晚上";
  };

  const period = getPeriod(hour);
  const timeStr = date.format("h:mm");

  if (date.isSame(now, "day")) {
    return `今天${period} ${timeStr}`;
  }

  if (date.isSame(now.add(1, "day"), "day")) {
    return `明天${period} ${timeStr}`;
  }

  return date.format("M月D日");
};
