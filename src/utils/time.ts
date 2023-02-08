import dayjs, { ConfigType } from "dayjs";

/**
 * 计算距离某日的天数之差
 * @param timeBefore
 * @param timeAfter
 * @returns 天数
 */
export const getDayInterval = (
  timeBefore: ConfigType,
  timeAfter?: ConfigType
) => {
  return dayjs(timeBefore)
    .diff(dayjs(dayjs(timeAfter).format("YYYY-MM-DD")), "day");
};

/**
 * 计算距离一天中某个时刻的时分时间差
 * @param timeBefore
 * @param timeAfter
 * @returns
 */
export const getHMInterval = (
  timeBefore: { hour: number; minute: number },
  timeAfter: { hour: number; minute: number }
) => {
  const minutesCount = {
    before: timeBefore.hour * 60 + timeBefore.minute,
    after: timeAfter.hour * 60 + timeAfter.minute
  };
  const restHours = Math.floor(minutesCount.before - minutesCount.after ) / 60;
  const restMinutes = minutesCount.before - minutesCount.after - restHours * 60;
  return {
    hours: restHours,
    minutes: restMinutes
  };
};

export default {
  getDayInterval,
  getHMInterval
};
