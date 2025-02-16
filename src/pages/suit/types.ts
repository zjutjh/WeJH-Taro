export enum CampusCodeEnum {
  ZH = 1,
  PF,
  MGS
}

export enum RentStatusEnum {
  /** 待处理 */
  PENDING = 1,
  /** 被驳回 */
  REJECTED,
  /** 借用中 */
  BORROWING,
  /** 已归还 */
  COMPLETED
}
