/**
 * 用户查看对应发布组织的问答
 * id  序号
 * title  标题
 * content  内容
 * publish_time  发布时间（2023-08-06T00:55:50+08:00 格式）
 * publisher  发布组织（“学生事务大厅”）
 */
export interface SuitFaq {
  id: number;
  title: string;
  content: string;
  publish_time: string,
  publisher: string
}

export type Spec = {
  id: number,
  /** 尺码 */
  spec: string,
  /** 库存 */
  stock: number
};

export type Suit = {
  img: string;
  name: string;
  /** 尺码 */
  specs: Spec[];
};

export interface SuitApplyRecord {
  id: number
  /* 状态 未审核 1 被驳回 2 借用中 3 已归还 4 */
  status: number
  /* 校区 */
  campus: number;
  /* 数量 */
  count: number;
  apply_time: string;
  borrow_time: string;
  return_time: string;
  name: string;
  kind: string;
  spec: string;
  img: string;
}
