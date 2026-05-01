import dayjs, { ConfigType } from "dayjs";

/**
 * 计算距离某日的天数之差
 * @param timeBefore
 * @param timeAfter
 * @returns 天数
 */
export const getDayInterval = (timeBefore: ConfigType, timeAfter?: ConfigType) =>
  dayjs(timeBefore).diff(dayjs(dayjs(timeAfter).format("YYYY-MM-DD")), "day");

/**
 * 计算距离一天中某个时刻的时分时间差
 * @param timeBefore
 * @param timeAfter
 * @returns
 */
export const getHMInterval = (
  timeBefore: { hour: number; minute: number },
  timeAfter?: { hour: number; minute: number }
) => {
  const minutesCount = {
    before: timeBefore.hour * 60 + timeBefore.minute,
    after:
      timeAfter?.hour || new Date().getHours() * 60 + (timeAfter?.minute || new Date().getMinutes())
  };
  const restHours = Math.floor((minutesCount.before - minutesCount.after) / 60);
  const restMinutes = minutesCount.before - minutesCount.after - restHours * 60;
  return { hours: restHours, minutes: restMinutes };
};

/**
 * 后端返回的 timeString 字符串格式为 yyyy-mm-dd(hh:mm-hh:mm)
 * 例如：2026-05-10(15:30-17:00)
 */
export function getDetailedTime(timeString: string) {
  const tmp: ConfigType = timeString.split("(")[0];
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"];

  const day = dayjs(tmp).day();
  const dayChar = dayChars.at(day);

  return dayChar ? `${tmp} - 周${dayChar}` : `${tmp}`;
}

export default {
  getDayInterval,
  getHMInterval,
  getDetailedTime
};
