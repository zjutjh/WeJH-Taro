import Taro from "@tarojs/taro";
import { useServiceStore } from "@/store";
import { FetchResult, fetch } from "@/utils";
import { api } from "@/services";
import { updateDateStateWithSession } from "../utils/updateDateState";
import errCodeHandler from "../utils/errHandler";
import { ServerCode } from "../api/codes";
import request from "../request";

const serviceStore = useServiceStore();
export default class UserService {
  static getUserTheme = () => {
    return request<{
      code: number,
      msg: string,
      theme_list: {
        id?: number;
        name?: string;
        theme_config?: string;
        type: string;
      }[]
    }>(
      api.user.theme.get, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID }
      }
    );
  };

  static setTheme = (data: { id: number }) => {
    return request<{
      code: number,
      msg: string,
      data: null,
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
      code: number,
      msg: string,
      data: null;
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
      code: number,
      msg: string,
      data: null;
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

  /** 小程序端激活账号 */
  static async createStudentInMP(params: {
    username: string;
    password: string;
    studentID: string;
    idCardNumber: string;
    email?: string;
  }) {
    try {
      const { code, errMsg } = await Taro.login({ timeout: 3000 });
      if (!code) {
        console.error(new Error(errMsg));
        return Promise.reject(
          new RequestError(errMsg, MPErrorCode.MP_LOGIN_ERROR_MISSING_WX_CODE)
        );
      }
      const taroWrapped = await Taro.request({
        url: import.meta.env.VITE_HOST + api.user.create.wechat,
        data: { ...params, code },
        method: "POST"
      });
      const { data: realResponse, cookies } = taroWrapped;
      if (realResponse && realResponse.code === ServiceErrorCode.OK) {
        if (cookies && cookies.length > 0) {
          const cookie = cookies[0]; // 现业务全局仅有一个 Cookie，所以取第一个
          CookieUtils.set(cookie);
        }
        return Promise.reject(
          new RequestError("用户激活失败", MPErrorCode.MP_ACTIVATE_ERROR_MISSING_COOKIE)
        );
      }
      throw new RequestError("小程序网络异常", MPErrorCode.MP_INVALID_RESPONSE_BODY);
    } catch (e) {
      console.error(e);
      if (e instanceof RequestError) {
        // TODO: if (e.code === )
        throw e;
      }
      throw new RequestError("小程序网络异常", MPErrorCode.MP_LOGIN_ERROR_UNKNOWN);
    }
  }
}
