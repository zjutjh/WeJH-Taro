import Taro from "@tarojs/taro";
import store, { serviceStore } from "@/store";
import { FetchResult, fetch } from "@/utils";
import { api } from "@/services";
import { updateDateStateWithSession } from "../utils/updateDateState";
import errCodeHandler from "../utils/errHandler";
import { ServerCode } from "../api/codes";
import request from "../request";
import { ThemeList } from "@/store/service/theme";

export default class UserService {
  static getUserTheme = () => {
    return request<{
      current_theme_id: number;
      current_theme_dark_id: number;
      theme_list: ThemeList
    }>(
      api.user.theme.get, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID }
      }
    );
  };

  static setTheme = (data: { id: number, dark_id: number }) => {
    return request<{
      null
    }>(
      api.user.theme.set, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };
  static logout = (data?: { iid: string, stuid: string }) => {
    return request<{
      null
    }>(
      api.user.logout, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };

  static changePassword = (data?: { iid: string, stuid: string, password: string }) => {
    return request<{
      null
    }>(
      api.user.changePassword, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data
      }
    );
  };

  // fix: param autoLogin is overriden by showModal
  static async bindLibrary(data?: { password: string }, showModal = true) {
    return updateDateStateWithSession(
      api.user.bind.library,
      data,
      "setBindLibrary",
      (res: FetchResult) => res.data.code === 1,
      true,
      showModal
    );
  }

  static async bindZF(data?: { password: string }, showModal = true) {
    return updateDateStateWithSession(
      api.user.bind.zf,
      data,
      "setBindZF",
      (res: FetchResult) => res.data.code === 1,
      true,
      showModal
    );
  }

  static async bindOauth(data?: { password: string }, showModal = true) {
    return updateDateStateWithSession(
      api.user.bind.oauth,
      data,
      "setBindOauth",
      (res: FetchResult) => res.data.code === 1,
      true,
      showModal
    );
  }

  // comment: 返回用户信息
  static async getUserInfo(autoLogin = true): Promise<any> {
    // comment: 创号成功，打开我的，每次 testSession 执行一次
    // testSession 进入时，autoLogin === false
    return await updateDateStateWithSession(
      api.user.info,
      null,
      "setUserInfo",
      (res: FetchResult) => {
        return res.data.data.user;
      },
      autoLogin
    );
  }

  static async createUserApp(userForm: {
    username: string;
    password: string;
    studentID: string;
    idCardNumber: string;
    email?: string;
    code?: string;
  }) {
    // comment: 获取表单信息之后再获得微信认证
    if (!userForm.code) {
      const res = await Taro.login({ timeout: 3000 });
      if (res.code) userForm.code = res.code;
      else return false;
    }

    // /api/user/create/student/wechat
    const res = await fetch.post(api.user.create.wechat, userForm);
    if (res.statusCode === 200 && res.data.code === ServerCode.OK) {
      if (res.cookies && res.cookies.length > 0) {
        store.commit("setSession", res.cookies[0]);
        UserService.getUserInfo();
      }
      return true;
    }
    Taro.hideLoading();
    await errCodeHandler(res.data.code, true);

    return false;
  }

  // DISPOSED
  // /api/user/create/student
  static async createUserH5(userForm: {
    username: string;
    password: string;
    studentID: string;
    idCardNumber: string;
  }) {
    const res = await fetch.post(api.user.create.h5, userForm);
    if (res.statusCode === 200) {
      if (res.cookies && res.cookies.length > 0) {
        store.commit("setSession", res.cookies[0]);
        UserService.getUserInfo();
      }
      return true;
    }

    return false;
  }
}
