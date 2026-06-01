import dayjs, { ConfigType as DayjsConfigType } from "dayjs";
import plugin from "dayjs/plugin/duration";

/**
 * 计算距离某日的分钟数之差
 * @param timeBefore
 * @param timeAfter
 * @returns 分钟数
 * @deprecated 建议所有时间差计算逻辑统一使用diffTime
 */
export function getMinuteInterval(timeBefore?: DayjsConfigType, timeAfter?: DayjsConfigType) {
  return dayjs(timeBefore).diff(dayjs(timeAfter).startOf("day"), "minute");
}

/** 时间单位 */
export type DiffTimeUnit = Exclude<keyof plugin.DurationUnitsObjectType, "weeks">;

/** 时间单位列表（从大到小） */
const timeUnitList = [
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
] as const satisfies DiffTimeUnit[];

/** 目标时间比基准时间更早/更晚/相等 */
export type DiffTimeType = "earlier" | "later" | "same" | "invalid";
interface DiffTimeOptions {
  /** 基准时间
   * @default 当前时间 */
  baseTime?: DayjsConfigType;
  /** 单位下限，更小单位的时间将直接舍去
   * @default "seconds"  */
  minUnit?: DiffTimeUnit;
  /** 单位上限，更大单位的时间将向下换算
   * @default "days" */
  maxUnit?: DiffTimeUnit;
}
export interface DiffTimeReturn {
  /** 目标时间比基准时间更早/更晚/相等 */
  diffType: DiffTimeType;
  /** 绝对值 */
  abs: plugin.Duration;
}
/** 计算目标时间相对于基准时间的差距，并按照maxUnit与minUnit进行换算和格式化 */
export const diffTime = (
  targetTime: DayjsConfigType,
  options: DiffTimeOptions = {}
): DiffTimeReturn => {
  // 设置options默认值
  const defaultOptions: Required<DiffTimeOptions> = {
    baseTime: dayjs(),
    minUnit: "seconds",
    maxUnit: "days"
  };
  // 合并传入的options并解构
  const { baseTime, minUnit, maxUnit } = {
    ...defaultOptions,
    ...options
  };

  /** 目标时间Dayjs实例 */
  const target = dayjs(targetTime);
  /** 基准时间Dayjs实例 */
  const base = dayjs(baseTime);

  // 无效时间
  if (!target.isValid() || !base.isValid())
    return {
      diffType: "invalid",
      abs: dayjs.duration(NaN)
    };

  /** 结果(差距绝对值) 对象形式 */
  const diffValue: plugin.DurationUnitsObjectType = {};

  // 比较时间先后
  let diffType: DiffTimeType;
  if (target.isBefore(base)) {
    diffType = "earlier";
  } else if (target.isAfter(base)) {
    diffType = "later";
  } else {
    diffType = "same";
  }

  // 不相等，计算时间差
  if (diffType !== "same") {
    /** maxUnit在timeUnitList中的索引 */
    const maxUnitIndex = timeUnitList.indexOf(maxUnit);
    /** minUnit在timeUnitList中的索引 */
    const minUnitIndex = timeUnitList.indexOf(minUnit);
    /** 用于计算时间差的临时量，从基准时间开始不断接近目标时间 */
    let approaching = base.clone();

    // 从大到小，计算每个单位的时间差
    for (const [curUnitIndex, unit] of timeUnitList.entries()) {
      // 当前单位比maxUnit大，跳过
      if (curUnitIndex < maxUnitIndex) continue;

      /** 当前单位下的时间差（整数） */
      const curUnitDiff = target.diff(approaching, unit);
      // 存入绝对值
      diffValue[unit] = Math.abs(curUnitDiff);

      // 已经到达minUnit，终止
      if (curUnitIndex >= minUnitIndex) break;

      // 抹去当前单位下的时间差，为下一个单位做准备
      approaching = approaching.add(curUnitDiff, unit);
    }
  }

  // 将各单位的空值填充为0
  timeUnitList.forEach((unit) => (diffValue[unit] ??= 0));

  return {
    diffType,
    abs: dayjs.duration(diffValue)
  };
};
