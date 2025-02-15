export function composeWeekdayString(weekday: string) {
  const charEnum = ["一", "二", "三", "四", "五", "六", "日"];
  return `周${charEnum[parseInt(weekday) - 1]}`;
}
