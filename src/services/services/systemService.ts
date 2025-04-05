import { api } from "../api/apiList";
import { updateDateState } from "../utils/updateDateState";
import { AppListItem } from "@/types/AppList";
import { Announcement } from "@/types/Announcement";
import { Information } from "@/types/Information";
import { serviceStore } from "@/store";
import request from "../request";

export default class SystemService {
  static async getAnnouncement(
    page = 1,
    size = 10
  ): Promise<Announcement[]> {
    return updateDateState(
      api.announcement,
      { page, size },
      "setAnnouncements"
    );
  }

  static getInformation = () => {
    return request<Information[]>(
      api.information, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID }
      }
    );
  };

  static async getAppList(): Promise<AppListItem[]> {
    return updateDateState(api.applist, null, "setApplist");
  }

  static async getGeneralInfo(): Promise<any> {
    return updateDateState(api.info, null, "setGeneralInfo");
  }
}
