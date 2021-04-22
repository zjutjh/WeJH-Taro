import Taro from "@tarojs/taro";
import fetch from "../utils/fetch/fetch";
import { api } from "./api/apiList";
import { serviceStore } from "../store/index";
import store from "../store/index";
import { testSession } from "./utils/session";

async function LoginByTaro(): Promise<Boolean> {
  if (serviceStore.sessionID && serviceStore.sessionID !== "")
    if (await testSession()) return true;

  let res = await Taro.login({ timeout: 3000 });
  if (res.code) {
    let fet = await fetch.post(api.user.login.wechat, { code: res.code });
    if (fet.cookies && fet.cookies.length > 0) {
      store.commit("setSession", fet.cookies[0]);
      return true;
    }
  }

  console.log("登录失败！" + res.errMsg);
  return false;
}

export { LoginByTaro };
