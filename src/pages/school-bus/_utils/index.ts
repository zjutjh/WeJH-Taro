import dayjs, { Dayjs } from "dayjs";
import { get } from "lodash-es";

/**
 * 路线名称解析
 *
 * @param raw 路线名称 e.g. `1号线（屏峰-朝晖）`
 */
export const parseRouteName = (raw: string) => {
  const match = raw.match(/^(.*?)（(.*?)-(.*?)）$/);

  return {
    busName: get(match, 1, raw),
    startDirection: get(match, 2, "--"),
    endDirection: get(match, 3, "--")
  };
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
