import store from "../store";
import { serviceStore } from "../store";
import { api } from "./api/apiList";
import fetch from "../utils/fetch/fetch";
class SystemService {
  static async getAnnouncement(nocache: boolean = false): Promise<any> {
    let fetchData = nocache;
    if (!serviceStore.announcement) {
      fetchData = true;
    }
    if (!fetchData) {
      return serviceStore.announcement;
    }
    store.commit("clearAnnouncement");
    let res = await fetch.post(api.announcement, null);
    if (res.statusCode === 200 && res.data) {
      store.commit("setAnnouncement", res.data.data);
      return res.data.data;
    }

    return null;
  }

  static async getApplist(nocache: boolean = false): Promise<any> {
    let fetchData = nocache;
    if (!serviceStore.applist) {
      fetchData = true;
    }
    if (!fetchData) {
      return serviceStore.applist;
    }
    store.commit("clearApplist");
    let res = await fetch.post(api.applist, null);
    if (res.statusCode === 200 && res.data) {
      store.commit("setApplist", res.data.data);
      return res.data.data;
    }

    return null;
  }
}

export default SystemService;
