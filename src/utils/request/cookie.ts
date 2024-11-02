import Taro from "@tarojs/taro";
import { persistedStorage } from "../storage";
import RequestError, { MPErrorCode, ServiceErrorCode } from "./requestError";
import { api } from "@/services";

export default class CookieUtils {
  private static keyInStorage = "__cookie__";
  private static cookie: string = "";

  /**
   * 从内存、持久化储存中获取 Cookie
   *
   * 若两处都没有 Cookie，则触发登录流程获取新的 Cookie
   *
   * @throws {RequestError}
   */
  public static async get(): Promise<string> {
    if (!this.cookie) {
      const cookieInStore = persistedStorage.getItem(this.keyInStorage);
      this.cookie = cookieInStore || await this.refresh();
    }

    return this.cookie;
  }

  public static set(value: string) {
    return persistedStorage.setItem(this.keyInStorage, value);
  }

  /**
   * 登录以获取服务端 Cookie
   *
   * @throws {RequestError}
   * @returns 新 Cookie
   */
  public static async refresh(): Promise<string> {
    try {
      const { code, errMsg } = await Taro.login({ timeout: 3000 });
      if (!code) {
        console.error(new Error(errMsg));
        return Promise.reject(
          new RequestError(errMsg, MPErrorCode.MP_LOGIN_ERROR_MISSING_WX_CODE)
        );
      }

      const taroWrapped = await Taro.request<{ data: { user: any }, code: number }>({
        url: import.meta.env.VITE_HOST + api.user.login.wechat,
        data: { code },
        method: "POST"
      });
      const { data: realResponse, cookies } = taroWrapped;
      if (realResponse && realResponse.code === ServiceErrorCode.OK) {
        if (cookies && cookies.length > 0) {
          const cookie = cookies[0]; // 现业务全局仅有一个 Cookie，所以取第一个
          persistedStorage.setItem(this.keyInStorage, cookie);
          return cookie;
        }
        return Promise.reject(
          new RequestError("小程序登录失败", MPErrorCode.MP_LOGIN_ERROR_MISSING_COOKIE)
        );
      }
      throw new RequestError("小程序网络异常", MPErrorCode.MP_INVALID_RESPONSE_BODY);
    } catch (e) {
      console.error(e);
      throw e instanceof RequestError
        ? e
        : new RequestError("小程序网络异常", MPErrorCode.MP_LOGIN_ERROR_UNKNOWN);
    }
  }

  public static clear() {
    persistedStorage.removeItem(this.keyInStorage);
  }
}
