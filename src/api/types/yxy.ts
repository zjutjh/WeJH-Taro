// 数据源为易校园的请求

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
    bus_time: Array<{
      departure_time: string;
      remain_seats: number;
      ordered_seats: number;
    }>;
  }>;
};
