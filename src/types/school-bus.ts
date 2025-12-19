/** 班次信息;
 * 前端有 班次 班车两个概念;
 * 班车是某条线路里不同时间班次的集合
 * 如早上6点发车的一号线 是班次
 * 一号线是班车  */

/** 后端维度的BusTime, 没有openType */
export interface BusTime {
  /** 线路名程 如1号线 */
  routeName: string;
  /** 起点 */
  start: string;
  /** 终点 */
  end: string;
  /** 票价 */
  price: number;
  /** 发车时间 */
  departureTime: string;
  /** 已约车票数 */
  orderedSeats: number;
  /** 剩余车票数 */
  remainSeats: number;
}

interface BusStation {
  stationName: string;
}

export interface BusRouteDetail {
  routeName: string;
  start: string;
  end: string;
  stations: BusStation[];
}

// --- 下面是前端自定义的一些类型，用于班车静态数据维护 --
export enum OpenTypeEnum {
  Weekday = "weekday",
  Weekend = "weekend",
  All = "all"
}

/** 前端维度的BusTime, 通过diyData手动维护着openType */
export interface FEBusTime extends BusTime {
  openType?: OpenTypeEnum;
}

/** 校车详情页的两个选项 */
export enum BusDetailPickerEnum {
  BusDetail = "班车详情",
  RouteTable = "线路详情"
}

/** 校车公告 */
export interface BusAnnounceItem {
  title: string;
  author: string;
  publishedAt: string;
  content: string;
  /** 摘要 */
  abstract: string;
}
