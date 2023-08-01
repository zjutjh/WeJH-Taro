export interface Information {
  id: number;
  title: string;
  content: string;
  publisher: string;
  /** 发布时间 */
  publish_time: string;
  /** 截止时间 用于控制是否显示在首页卡片上 */
  end_time: string;
  link: string;
  image_1: string;
  image_2: string;
  image_3: string;
}
