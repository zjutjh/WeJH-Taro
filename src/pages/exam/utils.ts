import dayjs, { ConfigType } from "dayjs";

export function getDetailedTime(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"];
  return `${tmp} - 周${dayChars[dayjs(tmp).day()]}`;
}

export function timeInterval(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  return dayjs(tmp).diff(dayjs(dayjs().format("YYYY-MM-DD")), "day");
}
