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
