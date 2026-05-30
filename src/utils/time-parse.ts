import dayjs from "dayjs";

export interface ParseZfExamTimeReturn {
  /** 考试开始时间 */
  startAt: dayjs.Dayjs;
  /** 考试结束时间 */
  endAt: dayjs.Dayjs;
}
/** 解析正方考试时间
 * @param zfTimeStr 例：2023-02-17(13:30-15:30) */
export const parseZfExamTime = (zfTimeStr: string): ParseZfExamTimeReturn => {
  /** 考试日期 正则字符串 */
  const dateRegStr = /([0-9]+-[0-9]+-[0-9]+)/.source;
  /** 开始与结束时刻 正则字符串 */
  const timeRegStr = /([0-9]+:[0-9]+)/.source;
  /** 完整正则表达式 */
  const regExp = new RegExp(String.raw`^${dateRegStr}\(${timeRegStr}-${timeRegStr}\)$`);

  /** 匹配结果 */
  const arr = regExp.exec(zfTimeStr.trim());
  const date = arr?.at(1);
  const startTime = arr?.at(2);
  const endTime = arr?.at(3);

  // 字符串不满足格式
  if (!(date && startTime && endTime))
    return {
      startAt: dayjs(NaN),
      endAt: dayjs(NaN)
    };

  return {
    startAt: dayjs(`${date} ${startTime}`),
    endAt: dayjs(`${date} ${endTime}`)
  };
};
