import dayjs, { ConfigType } from "dayjs";
import plugin from "dayjs/plugin/duration";

/** 时间单位 */
export type TimeDiffUnit = Exclude<keyof plugin.DurationUnitsObjectType, "weeks">;

/** 时间单位列表（从大到小） */
const timeUnitList = [
  "years",
  "months",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
] as const satisfies TimeDiffUnit[];

/** 计算时间是周几，返回单个汉字 */
export const getWeekday = (time: ConfigType) => {
  const dayChars = ["日", "一", "二", "三", "四", "五", "六"] as const;
  return dayChars.at(dayjs(time).day());
};

/** 目标时间比基准时间更早/更晚/相等 */
export type TimeDiffType = "earlier" | "later" | "same" | "invalid";
interface TimeDiffOptions {
  /** 基准时间
   * @default 当前时间 */
  baseTime?: ConfigType;
  /** 单位下限，更小单位的时间将进行舍入
   * @default "seconds"  */
  minUnit?: TimeDiffUnit;
  /** 单位上限，更大单位的时间将向下换算
   * @default "days" */
  maxUnit?: TimeDiffUnit;
  /** 是否舍入到结果中最大的单位
   * @default false */
  roundToLargestUnit?: boolean;
  /** 溢出minUnit的时间的舍入方式
   * @default "floor" */
  roundingMethod?: "floor" | "ceil" | ((float: number) => number);
}
/** 计算目标时间相对于基准时间的差距，并按照maxUnit与minUnit进行换算和格式化 */
export const diffTime = (targetTime: ConfigType, options: TimeDiffOptions = {}) => {
  // 设置options默认值
  const defaultOptions: Required<TimeDiffOptions> = {
    baseTime: dayjs(),
    minUnit: "seconds",
    maxUnit: "days",
    roundToLargestUnit: false,
    roundingMethod: "floor"
  };
  // 合并传入的options并解构
  const { baseTime, minUnit, maxUnit, roundToLargestUnit, roundingMethod } = Object.assign(
    {},
    defaultOptions,
    options
  );

  /** 目标时间Dayjs实例 */
  const target = dayjs(targetTime);
  /** 基准时间Dayjs实例 */
  const base = dayjs(baseTime);

  // 无效时间
  if (!target.isValid() || !base.isValid()) {
    return {
      type: "invalid" as TimeDiffType,
      abs: dayjs.duration(NaN)
    };
  }

  /** 结果(差距绝对值) 对象形式 */
  const diffValue: plugin.DurationUnitsObjectType = {};

  /** 目标时间比基准时间更早/更晚/相等 */
  let diffType: TimeDiffType;
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
    /** 目标时间比基准时间更早/更晚/相等 */
    type: diffType,
    /** 绝对值 */
    abs: dayjs.duration(diffValue)
  };
};

interface FormatDurationOptions {
  /** 在不同单位之间添加分隔符
   * @default " " */
  separator?: string;
  /** 是否去除前导的数字为0的单位
   * @default true */
  isRemoveLeadingZero?: boolean;
  /** 是否去除中间的数字为0的单位
   * @default false */
  isRemoveMiddleZero?: boolean;
  /** 是否去除尾随的数字为0的单位
   * @default true */
  isRemoveTrailingZero?: boolean;
}
/** 格式化Dayjs Duration为文本 */
export const formatDuration = (duration: plugin.Duration, options: FormatDurationOptions = {}) => {
  // 设置options默认值
  const defaultOptions: Required<FormatDurationOptions> = {
    separator: " ",
    isRemoveLeadingZero: true,
    isRemoveMiddleZero: false,
    isRemoveTrailingZero: true
  };
  // 合并传入的options并解构
  const { separator, isRemoveLeadingZero, isRemoveMiddleZero, isRemoveTrailingZero } =
    Object.assign({}, defaultOptions, options);

  /** Dayjs RelativeTime本地化表 */
  const relativeTimeFormatMap = dayjs.Ls[dayjs.locale()].relativeTime;
  /** 大于秒的时间单位 与 Dayjs RelativeTime本地化键 的关系 */
  const relativeTimeKeyMap: Record<
    Exclude<TimeDiffUnit, "seconds" | "milliseconds">,
    {
      singular: keyof typeof relativeTimeFormatMap;
      plural: keyof typeof relativeTimeFormatMap;
    }
  > = {
    minutes: {
      singular: "m",
      plural: "mm"
    },
    hours: {
      singular: "h",
      plural: "hh"
    },
    days: {
      singular: "d",
      plural: "dd"
    },
    months: {
      singular: "M",
      plural: "MM"
    },
    years: {
      singular: "y",
      plural: "yy"
    }
  };

  // 如果时长不足1分钟，直接返回"几秒"
  if (duration.asMinutes() < 1) {
    return relativeTimeFormatMap["s"];
  }

  /** 数字为0的单位中，要去除的单位的集合 */
  let zeroNumUnitSetToRemove = new Set<TimeDiffUnit>();
  // 根据isRemoveMiddleZero初始化集合
  if (isRemoveMiddleZero) {
    // 将所有数字为0的单位加入集合
    zeroNumUnitSetToRemove = new Set(timeUnitList.filter((unit) => duration.get(unit) === 0));
  }
  // 根据isRemoveLeadingZero，设置前导的数字为0的单位的去留
  for (let index = 0; index < timeUnitList.length; ++index) {
    const unit = timeUnitList[index];
    if (duration.get(unit) === 0) {
      if (isRemoveLeadingZero) zeroNumUnitSetToRemove.add(unit);
      else zeroNumUnitSetToRemove.delete(unit);
    } else {
      break;
    }
  }
  // 根据isRemoveTrailingZero，设置尾随的数字为0的单位的去留
  for (let index = timeUnitList.length - 1; index >= 0; --index) {
    const unit = timeUnitList[index];
    if (duration.get(unit) === 0) {
      if (isRemoveTrailingZero) zeroNumUnitSetToRemove.add(unit);
      else zeroNumUnitSetToRemove.delete(unit);
    } else {
      break;
    }
  }

  const unitDataArr: string[] = [];

  // 从大到小，格式化每个单位的时间
  for (const unit of timeUnitList) {
    if (unit === "seconds" || unit === "milliseconds") continue;
    // 如果当前单位在zeroNumUnitSetToRemove中，跳过
    if (zeroNumUnitSetToRemove.has(unit)) continue;
    /** 当前单位下的时间数字 */
    const curUnitDiff = duration.get(unit);

    /** 当前单位下时间的格式化文本 */
    let curUnitText: string;
    if (curUnitDiff !== 0 && Math.abs(curUnitDiff) <= 1) {
      curUnitText = (
        relativeTimeFormatMap[relativeTimeKeyMap[unit].singular] ?? `$d ${unit}`
      ).replace("%d", curUnitDiff.toString());
    } else {
      curUnitText = (
        relativeTimeFormatMap[relativeTimeKeyMap[unit].plural] ?? `$d ${unit}`
      ).replace("%d", curUnitDiff.toString());
    }
    unitDataArr.push(curUnitText);
  }

  return unitDataArr.join(separator) || relativeTimeFormatMap["s"];
};

/** 解析正方考试时间 */
export const parseZfExamTime = (zfTimeStr: string) => {
  const result = {
    /** 考试开始时间 */
    startAt: dayjs(NaN),
    /** 考试结束时间 */
    endAt: dayjs(NaN),
    /** 时间是否有效 */
    isValid: false
  };

  /** 考试日期 正则字符串 */
  const dateRegStr = /([0-9]+-[0-9]+-[0-9]+)/.source;
  /** 开始与结束时刻 正则字符串 */
  const timeRegStr = /([0-9]+:[0-9]+)/.source;
  /** @example 2023-02-17(13:30-15:30) */
  const regExp = new RegExp(String.raw`^${dateRegStr}\(${timeRegStr}-${timeRegStr}\)$`);

  /** 匹配结果 */
  const arr = regExp.exec(zfTimeStr.trim());
  const date = arr?.at(1);
  const startTime = arr?.at(2);
  const endTime = arr?.at(3);

  // 字符串不满足格式
  if (!(date && startTime && endTime)) return result;

  // 解析字符串
  result.startAt = dayjs(`${date} ${startTime}`);
  result.endAt = dayjs(`${date} ${endTime}`);
  result.isValid = true;

  return result;
};
