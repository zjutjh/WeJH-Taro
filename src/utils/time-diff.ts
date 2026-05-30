import dayjs, { ConfigType as DayjsConfigType } from "dayjs";
import plugin from "dayjs/plugin/duration";

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
  /** 单位下限，更小单位的时间将进行舍入
   * @default "seconds"  */
  minUnit?: DiffTimeUnit;
  /** 单位上限，更大单位的时间将向下换算
   * @default "days" */
  maxUnit?: DiffTimeUnit;
  /** 是否舍入到结果中最大的单位
   * @default false */
  roundToLargestUnit?: boolean;
  /** 溢出minUnit的时间的舍入方式
   * @default "floor" */
  roundingMethod?: "floor" | "ceil" | ((float: number) => number);
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
    maxUnit: "days",
    roundToLargestUnit: false,
    roundingMethod: "floor"
  };
  // 合并传入的options并解构
  const { baseTime, minUnit, maxUnit, roundToLargestUnit, roundingMethod } = {
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
    /** 结果中包含的最小时间单位，更小单位的时间将进行舍入 */
    let smallestUnit = minUnit;

    /** maxUnit在timeUnitList中的索引 */
    const maxUnitIndex = timeUnitList.indexOf(maxUnit);
    /** minUnit在timeUnitList中的索引 */
    const minUnitIndex = timeUnitList.indexOf(minUnit);
    /** 用于计算时间差的临时量，从基准时间开始不断接近目标时间 */
    let approaching = base.clone();

    // 从大到小，计算每个单位的时间差
    for (let curUnitIndex = 0; curUnitIndex < timeUnitList.length; ++curUnitIndex) {
      /** 当前单位 */
      const unit = timeUnitList[curUnitIndex];
      // 当前单位比maxUnit大，跳过
      if (curUnitIndex < maxUnitIndex) continue;

      /** 当前单位下的时间差（整数） */
      const curUnitDiff = target.diff(approaching, unit);
      // 存入绝对值
      diffValue[unit] = Math.abs(curUnitDiff);

      // 已经到达minUnit，终止
      if (curUnitIndex >= minUnitIndex) break;

      // 当前单位下，时间差不为0，且roundToLargestUnit为true
      if (roundToLargestUnit && curUnitDiff !== 0) {
        // 更新smallestUnit为当前单位
        smallestUnit = unit;
        // 终止
        break;
      }

      // 抹去当前单位下的时间差，为下一个单位做准备
      approaching = approaching.add(curUnitDiff, unit);
    }

    // 舍入操作
    if (smallestUnit !== "milliseconds") {
      /** 计算smallestUnit下，的时间差绝对值（浮点数） */
      const floatDiffAbs = Math.abs(target.diff(approaching, smallestUnit, true));
      switch (roundingMethod) {
        case "floor":
          // 直接舍去小数
          diffValue[smallestUnit] = Math.floor(floatDiffAbs);
          break;
        case "ceil":
          // 直接进位
          diffValue[smallestUnit] = Math.ceil(floatDiffAbs);
          break;
        default:
          // 自定义舍入函数
          diffValue[smallestUnit] = roundingMethod(floatDiffAbs);
          break;
      }
    }
  }

  // 将各单位的空值填充为0
  timeUnitList.map((unit) => (diffValue[unit] ??= 0));

  return {
    diffType,
    abs: dayjs.duration(diffValue)
  };
};
