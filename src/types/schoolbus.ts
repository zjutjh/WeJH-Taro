/** 班次信息;
 * 前端有 班次 班车两个概念;
 * 班车是某条线路里不同时间班次的集合
 * 如早上6点发车的一号线 是班次
 * 一号线是班车  */
interface BusTime {
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

/** 班车信息，起终点相反的算作不同 */
interface BusInformation {
  busTime: BusTime[];
  /** 线路名称 */
  name: string;
  /** 价格 */
  price: number;
  seats: number;
  /** 站点 */
  stations: BusStation[];
}

// --- 下面是前端自定义的一些类型，用于班车静态数据维护 --
export enum OpenTypeEnum {
  Weekday = "weekday",
  Weekend = "weekend",
  All = "all"
}

export interface FEBusTime extends BusTime {
  openType: OpenTypeEnum;
  /** 线路名程, 应copy对应班车里的name字段 */
  routeName: string;
  /** 起点 */
  start: string;
  /** 终点 */
  end: string;
  /** 票价 */
  price: number;
}

export interface FEBusInformation extends BusInformation {
  /** 不管节假日，全集的班次时间 */
  busTime: FEBusTime[];
}
