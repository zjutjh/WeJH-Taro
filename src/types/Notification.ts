
/**
  * 功能通知，小红点/角标
  *
  * 叶节点为 `null` 表示模块无通知,
  * 为 `string` 表示模块的通知内容
  */
export interface Notification {
  my: {
    bind: string | null;
  }
}
