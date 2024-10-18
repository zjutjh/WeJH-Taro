import Taro from "@tarojs/taro";
import { persistedStateStorage } from "../storage";
import RequestError, { MPErrorCode, ServiceErrorCode } from "./requestError";
import { api } from "@/services";

export default class CookieUtils {
  private static keyInStorage = "__cookie__";
  private static cookie: string = "";

  /**
   * 从内存、持久化储存中获取 Cookie
   *
   * 若两处都没有 Cookie，则触发登录流程获取新的 Cookie
   */
  public static async get(): Promise<string> {
    if (!this.cookie) {
      const cookieInStore = persistedStateStorage.getItem(this.keyInStorage);
      this.cookie = cookieInStore || await this.makeFresh();
    }

    return this.cookie;
  }

  /**
   * 登录以获取服务端 Cookie
   *
   * @throws {RequestError}
   */
  public static async makeFresh(): Promise<void> {
    try {
      const { code, errMsg } = await Taro.login({ timeout: 3000 });
      if (!code) {
        console.error(new Error(errMsg));
        return Promise.reject(new RequestError({ message: errMsg, code: MPErrorCode.MP_LOGIN_ERROR_MISSING_WX_CODE }));
      }

      const loginResult = await Taro.request<{ data: { user: any }, code: number }>({
        url: process.env.HOST + api.user.login.wechat,
        data: { code },
        method: "POST"
      });

      if (loginResult.data.code === ServiceErrorCode.OK) {
        if (loginResult.cookies && loginResult.cookies.length > 0) {
          const cookie = loginResult.cookies[0];
          persistedStateStorage.setItem(this.keyInStorage, cookie);
          return;
        }
      }
      return Promise.reject(
        new RequestError({ message: "小程序登录失败", code: MPErrorCode.MP_LOGIN_ERROR_MISSING_COOKIE })
      );
    } catch (e) {
      console.error(e);
      throw new RequestError({ message: "小程序登录失败", code: MPErrorCode.MP_LOGIN_ERROR_UNKNOWN });
    }
  }

  public static clear() {
    persistedStateStorage.removeItem(this.keyInStorage);
  }
}