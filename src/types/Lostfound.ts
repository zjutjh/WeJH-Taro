export interface LostfoundRecord {
  id: number;
  /** 校区 */
  campus: string;
  /** 内容 */
  content: string;
  img1: string | null;
  img2: string | null;
  img3: string | null;
  /** 所属类别 e.g. 雨伞 */
  kind: string;
  publish_time: string;
  /** 发布信息的组织名称 */
  publisher: string;
  /** 寻物启事 true, 失物招领 false */
  type: boolean;
}
