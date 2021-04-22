import Taro from "@tarojs/taro";
import store from "../store";
import { serviceStore } from "../store";
import fetch from "../utils/fetch/fetch";
import { api } from "./api/apiList";
import { postWithSession } from "./utils/session";
class UserService {
  bindLibrary() {}
  bindZF() {}
  bindCard() {}

  static async getUserInfo(nocache: boolean = false): Promise<any> {
    let fetchData = nocache;
    if (!serviceStore.user) {
      fetchData = true;
    }
    if (!fetchData) {
      return serviceStore.user;
    }

    store.commit("clearUser");
    let res = await postWithSession(api.user.info);
    if (res.statusCode === 200 && res.data) {
      store.commit("setUser", res.data.data.user);
      return res.data.data.user;
    }

    return null;
  }

  static async createUserApp(userForm: {
    username: string;
    password: string;
    studentID: string;
    idCardNumber: string;
    type?: "weapp" | "h5";
    code?: string;
  }) {
    if (!userForm.code) {
      let res = await Taro.login({ timeout: 3000 });
      if (res.code) {
        userForm.code = res.code;
      } else return false;
    }

    let res = await fetch.post(api.user.login.wechat, userForm);
    if (res.statusCode === 200 && res.cookies && res.cookies.length > 0) {
      store.commit("setSession", res.cookies[0]);
      return true;
    }

    return false;
  }
}

export default UserService;
