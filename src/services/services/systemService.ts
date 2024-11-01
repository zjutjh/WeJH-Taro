import { api } from "../api/apiList";
import { AppListItem } from "@/types/AppList";
import { Announcement } from "@/types/Announcement";
import { Information } from "@/types/Information";
import { request } from "@/utils";
import { Theme } from "@/store/service/theme";

export default class SystemService {
  /** 精弘通知 */
  static getAnnouncement() {
    return request<Announcement[]>(
      api.announcement, {
        method: "POST",
        auth: false
      }
    );
  }

  /** 校园资讯 */
  static getInformation() {
    return request<Information[]>(api.information);
  };

  // TODO: 从配置平台中获取，包括 app list item 的 require 属性
  static getAppList(): Promise<AppListItem[]> {
    return request(api.applist, { method: "POST", auth: false });
  }

  /** 学期学年信息 */
  static getGeneralInfo(): Promise<{
    defaultTheme: Theme;
    fileUrl: string;
    is_begin: boolean;
    jpgUrl: string;
    /** 新生提醒 */
    registerTips: string;
    schoolBusUrl: string;
    scoreTerm: "上" | "下" | "短";
    scoreYear: string;
    term: "上" | "下" | "短";
    /** 学期开始时间 */
    termStartDate: string;
    /** 学年 */
    termYear: string;
    /** 当前时间, 没什么用 */
    time: string;
    /** 距离开学周的周数 */
    week: number;
  }> {
    return request(api.info, { method: "POST", auth: false });
  }
}
