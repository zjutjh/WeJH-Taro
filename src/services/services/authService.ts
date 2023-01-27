import Taro from "@tarojs/taro";
import { fetch, FetchResult } from "@/utils";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import store from "@/store";
import { testSession } from "../utils/session";
import { throttle2 } from "@/utils";
import errCodeHandler from "../utils/errHandler";
import { ServerCode } from "../api/codes";

// comment: 与微信建立链接，获取 session
// 场景: 发送带 session 的请求 postWithSession，打开小程序页面
async function LoginByTaroImpl(): Promise<boolean> {
  // TODO:

  // comment: 已经有 session 了，并且有激活记录了，无需再获取 session 激活
  if (serviceStore.sessionID && serviceStore.sessionID !== "") {
    if (await testSession()) return true;
  }

  store.commit("clearSession");
  let fet: FetchResult | undefined;
  const res = await Taro.login({ timeout: 3000 });
  const code = res.code;
  if (!code) return false;
  fet = await fetch.post(api.user.login.wechat, { code: res.code });

  if (fet.data.code === ServerCode.OK)
    if (fet.cookies && fet.cookies.length > 0) {
      store.commit("setSession", fet.cookies[0]);
      store.commit("setUserInfo", fet.data.data.user);
      return true;
    }

  errCodeHandler(fet.data.code);
  return false;
}

// TODO: 密码登录
async function LoginWithPasswordImpl(
  username: string,
  password: string
): Promise<boolean> {
  let fet: FetchResult | undefined;
  fet = await fetch.post(api.user.login.password, {
    username, password
  });
  console.log(fet);

  if (fet.cookies && fet.cookies.length > 0) {
    store.commit("setSession", fet.cookies[0]);
    store.commit("setUserInfo", fet.data.data.user);
    await Taro.navigateTo({
      url: "/pages/my/index"
    });
  }

  return false;
}

const LoginByTaro = throttle2(LoginByTaroImpl);

const LoginWithPassword = throttle2(LoginWithPasswordImpl);

export { LoginByTaro, LoginWithPassword };
