/** 班次信息;
 * 前端有 班次 班车两个概念;
 * 班车是某条线路里不同时间班次的集合
 * 如早上6点发车的一号线 是班次
 * 一号线是班车  */

import { type Dayjs } from "dayjs";

// 班次开放日期类型
export enum OpenTypeEnum {
  /** 仅工作日 */
  Weekday = "weekday",
  /** 仅节假日 */
  Weekend = "weekend",
  /** 都开放 */
  All = "all",
  /** 未知 */
  Unknown = "unknown"
}

/**
 * 班次信息, 解析了一些硬编码字段
 */
export interface ParsedBusSchedule {
  /** 唯一标识符 */
  id: string;
  /** 班车名称，如1号线 */
  busName: string;
  /** 起始方向，比如「屏峰」，通过解析得到。注意和 **起始站点(`startStation`)** 区分 */
  startDirection: string;
  /** 终止方向，比如「屏峰」，通过解析得到。注意和 **终点站点(`endStation`)** 区分 */
  endDirection: string;
  /** 途径站点，比如屏峰校区的站点「语林楼」 */
  stationList?: string[];
  /** 票价，单位「分」 */
  price: number;
  /** 发车时间 */
  departureTime: Dayjs;
  /** 已约车票数 */
  orderedSeats: number;
  /** 剩余车票数 */
  remainSeats: number;
  /** 节假日开放时间的类型 */
  openType?: OpenTypeEnum;
  /** 出现在搜索结果中的关键词匹配原因 */
  matchReason?: {
    /** 匹配到的属性 */
    matchProperty: string;
    /** 匹配到的值，不管是否局部匹配，matchValue 都是完整的值 */
    matchValue: string;
  };
}
