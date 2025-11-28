import Taro from "@tarojs/taro";
import { get } from "lodash-es";

import { aegis } from "@/plugins/aegis";
import { api } from "@/services";
import store, { serviceStore } from "@/store";
import { ThemeList } from "@/store/service/theme";
import { fetch, FetchResult } from "@/utils";

import { ServerCode } from "../api/codes";
import request from "../request";
import errCodeHandler from "../utils/errHandler";
import { updateDateStateWithSession } from "../utils/updateDateState";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UserService {
  static getUserTheme = () => {
    return request<{
      current_theme_id: number;
      current_theme_dark_id: number;
      theme_list: ThemeList;
    }>(api.user.theme.get, {
      method: "GET",
      header: { Cookie: serviceStore.sessionID }
    });
  };

  static setTheme = (data: { id: number; dark_id: number }) => {
    return request<{
      null;
    }>(api.user.theme.set, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data
    });
  };
  static logout = (data?: { iid: string; stuid: string }) => {
    return request<{
      null;
    }>(api.user.logout, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data
    });
  };

  static changePassword = (data?: { iid: string; stuid: string; password: string }) => {
    return request<{
      null;
    }>(api.user.changePassword, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data
    });
  };

  static async bindLibrary(data?: { password: string }) {
    return updateDateStateWithSession(
      api.user.bind.library,
      data,
      "setBindLibrary",
      (res: FetchResult) => res.data.code === 1
    );
  }

  static async bindZF(data?: { password: string }) {
    return updateDateStateWithSession(
      api.user.bind.zf,
      data,
      "setBindZF",
      (res: FetchResult) => res.data.code === 1
    );
  }

  static async bindOauth(data?: { password: string }) {
    return updateDateStateWithSession(
      api.user.bind.oauth,
      data,
      "setBindOauth",
      (res: FetchResult) => res.data.code === 1
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getUserInfo(): Promise<any> {
    // testSession 进入时，autoLogin === false
    const data = await updateDateStateWithSession(
      api.user.info,
      null,
      "setUserInfo",
      (res: FetchResult) => {
        return res.data.data.user;
      }
    );

    // TODO: 后续切换到新请求方式后，更新 aegis 的参数也要兼容
    const studentID = get(data, ["data", "user", "studentID"], "");
    aegis.setConfig({ uin: studentID });

    return data;
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
    Taro.showToast({ title: res.data.msg, icon: "none" });
    await errCodeHandler(res.data.code);

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
