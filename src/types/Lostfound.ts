export interface LostfoundRecord {
  id: number;
  /** 寻物启事 true, 失物招领 false */
  type: boolean;
  /** 校区 */
  campus: string;
  /** 所属类别 e.g. 雨伞 */
  kind: string;
  publish_time: string;
  /** 发布信息的组织名称 */
  img1: string | null;
  img2: string | null;
  img3: string | null;
  publisher: string;
  item_name: string;
  lost_or_found_place: string;
  lost_or_found_time: string;
  pickup_place: string;
  /** 联系电话 **/
  contact: string;
  introduction: string;
}
