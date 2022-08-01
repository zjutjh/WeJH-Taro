export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishTime: string;
  readTime?: string;
  // readTime 用于记录用户已读数据，接口并不提供该属性
}
