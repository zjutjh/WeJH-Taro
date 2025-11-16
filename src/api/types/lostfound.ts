/** 查询物品类型列表 */
export type QueryKindListResponse = Array<{
  id: number;
  kind_name: string;
}>;

/** 获取分页的失物招领信息 */
export type QueryLostRecordsRequest = {
  /** 默认为屏峰 */
  campus: string;
  /** 物品种类，空字符串代表全部 */
  kind: string;
  page_num: number;
  page_size: number;
  /** 记录类型，空字符串代表全部 */
  lost_or_found: string;
};

export type QueryLostRecordsResponse = {
  data: Array<{
    id: number;
    /** false:寻物启事；true: 失物招领 */
    type: boolean;
    campus: string;
    kind: string;
    publish_time: string;
    img1: string;
    img2: string;
    img3: string;
    publisher: string;
    item_name: string;
    /** 丢失或拾得地点 */
    lost_or_found_place: string;
    /** 丢失或拾得时间 */
    lost_or_found_time: string;
    /** 领取地点，仅失物显示 */
    pickup_place: string;
    /** 联系方式，仅寻物显示 */
    contact: string;
    /** 物品介绍 */
    introduction: string;
  }>;
  total_page_num: number;
};
