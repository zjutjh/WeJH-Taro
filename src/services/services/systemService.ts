import { api } from "../api/apiList";
import { updateDateState } from "../utils/updateDateState";
import { AppListItem } from "@/types/AppList";
import { Announcement } from "@/types/Announcement";
import { Information } from "@/types/Information";
import { serviceStore } from "@/store";
import request from "../request";

// comment: 这里的所有请求无需 session
export default class SystemService {
  // comment: 系统通知
  static async getAnnouncement(
    page = 1,
    size = 10
  ): Promise<Announcement[]> {
    return updateDateState(
      api.announcement,
      { page, size },
      "setAnnouncements",
      null
    );
  }

  // comment: 校园资讯
  static getInformation = () => {
    return request<Information[]>(
      api.information, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID }
      }
    );
  };

  // comment: 首页应用列表
  static async getAppList(): Promise<AppListItem[]> {
    // comment: 缓存 applist
    // return updateDateState(api.applist, null, 'setApplist', 'clearApplist');
    return updateDateState(api.applist, null, "setApplist", null);
  }

  // comment: 学期学年信息
  static async getGeneralInfo(): Promise<any> {
    return updateDateState(api.info, null, "setGeneralInfo", null);
  }
}
