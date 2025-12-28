// 数据源为易校园的请求

/** 电费查询校区，默认为 zhpf */
export type CampusOption = "zhpf" | "mgs";

/** 查询房间电费余额 */
export type QueryBalanceRequest = {
  campus: CampusOption;
};

export type QueryBalanceResponse = {
  display_room_name: string;
  room_str_concat: string;
  /** 电费余额 */
  soc: number;
};

/** 查询房间电费充值记录 */
export type QueryChargeRecordRequest = {
  page: string;
  campus: CampusOption;
};

export type QueryChargeRecordResponse = Array<{
  room_dm: string;
  datetime: string;
  buy_type: string;
  using_type: string;
  money: string;
  is_send: string;
}>;

/** 查询房间电费消费细则 */
export type QueryConsumptionRecordRequest = {
  campus: CampusOption;
};

export type QueryConsumptionRecordResponse = Array<{
  datetime: string;
  room_dm: string;
  used: string;
}>;

/** 订阅低电量提醒 */
export type CreateSubscriptionRequest = {
  campus?: CampusOption;
  /** 低电量阈值 */
  threshold?: number;
};

/** 查看低电量订阅信息 */
export type QuerySubscriptionRequest = {
  campus: CampusOption;
};

export type QuerySubscriptionResponse = {
  id: number;
  user_id: number;
  campus: CampusOption;
  threshold: number;
  count: number;
};

/** 查询校车信息请求 */
export type QueryBusInfoRequest = {
  /** 输入框拼接字段 */
  search?: string;
};

/** 查询校车信息 */
export type QueryBusInfoResponse = {
  max_page: number;
  list: Array<{
    name: string;
    seats: number;
    price: number;
    stations: string[];
    bus_time?: Array<{
      departure_time: string;
      remain_seats: number;
      ordered_seats: number;
    }>;
  }>;
};

/** 查询校车公告请求 */
export type QueryBusAnnounceRequest = {
  page?: string;
  page_size?: string;
};

/** 查询校车公告响应 */
export type QueryBusAnnounceResponse = {
  updated_at: string;
  total: number;
  list: Array<{
    title: string;
    author: string;
    published_at: string;
    content: string;
    /** 摘要 */
    abstract: string;
  }>;
};

export interface BusStaticConfigItem {
  name: string;
  start: string;
  end: string;
  stations: string[];
  bus_time: Array<{
    /** e.g. `8:00` / `08:00` / `23:00` */
    departure_time: string;
    open_type: string;
  }>;
}

export type QueryBusConfigResponse = BusStaticConfigItem[];
