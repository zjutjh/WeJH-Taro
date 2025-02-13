import Taro from "@tarojs/taro";
import { MPErrorCode, request, RequestError } from "@/utils";
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

  static login = async () => {
    try {
      const { code } = await Taro.login({ timeout: 3000 });
      const { cookies } = await Taro.request({
        url: import.meta.env.VITE_HOST + api.user.login.wechat,
        data: { code },
        method: "POST"
      });
      return cookies?.at(0) ?? "";
    } catch {
      throw new RequestError("小程序网络异常", MPErrorCode.MP_LOGIN_ERROR_UNKNOWN);
    }
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
    /** 微信登录凭证 */
    code: string;
  }) {
    return request(api.user.create.wechat, {
      params,
      method: "POST"
    });
  }
}
