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
    id: string;
    name: string;
    start: string;
    end: string;
    seats: number;
    price: number;
    stations: Array<{
      id: string;
      station_name: string;
      station_seq: number;
    }>;
    bus_time: Array<{
      id: string;
      departure_time: string;
      remain_seats: number;
      ordered_seats: number;
    }>;
  }>;
};
