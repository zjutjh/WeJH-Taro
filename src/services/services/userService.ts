import Taro from "@tarojs/taro";
import { request, RequestError, MPErrorCode, ServiceErrorCode, CookieUtils } from "@/utils";
import { api } from "@/services";
import { Theme } from "@/store/service/theme";

export default class UserService {
  static getUserTheme = () => {
    return request<{
      theme_list: Theme[];
      current_theme_id: number;
    }>(api.user.theme.get);
  };

  static setTheme = (params: { id: number }) => {
    return request<null>(
      api.user.theme.set, {
        method: "POST",
        params
      }
    );
  };

  static logout = (params: { iid: string, stuid: string }) => {
    return request<null>(
      api.user.logout, {
        method: "POST",
        params
      }
    );
  };

  static changePassword = (params: { iid: string, stuid: string, password: string }) => {
    return request<null>(
      api.user.changePassword, {
        method: "POST",
        params
      }
    );
  };

  static async bindLibrary(params: { password: string }) {
    return request<null>(
      api.user.bind.library, {
        method: "POST",
        params
      }
    );
  }

  static async bindZF(params: { password: string }) {
    return request<null>(
      api.user.bind.zf, {
        method: "POST",
        params
      }
    );
  }

  static async bindOauth(params: { password: string }) {
    return request<null>(
      api.user.bind.oauth, {
        method: "POST",
        params
      }
    );
  }

  static async getUserInfo() {
    return request<{
      user: {
        bind: {
          oauth: boolean;
          lib: boolean;
          yxy: boolean;
          zf: boolean;
        };
        createTime: string;
        id: number;
        phoneNum: string;
        studentID: string;
        username: string;
        userType: number;
      }
    } >(
      api.user.info, {
        method: "POST"
      }
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
