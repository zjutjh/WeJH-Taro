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
