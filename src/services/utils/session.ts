import { ejectCookies, FetchResult, fetch } from "@/utils";
import store, { serviceStore } from "@/store";
import UserService from "../services/userService";
import { LoginByTaro } from "../services/authService";
import { ServerCode } from "../api/codes";

/**
 * @deprecated
 * 调用 fetch 带上 session 发送请求
 *
 * 一般通过 `updateDateStateWithSession` 调用
 * @param url
 * @param data
 * @param autoLogin
 * @returns
 */
async function postWithSession(
  url: string,
  data?: undefined | object,
  autoLogin = true
): Promise<FetchResult | null> {
  let res: FetchResult | null = null;
  const hasSession = checkSession();
  // comment: 有 session
  if (hasSession && serviceStore.sessionID) {
    res = await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
  }

  // comment: 如果刚才发出了请求，并且有结果，就直接返回结果
  // TODO: NotLogin
  if (res !== null && hasSession) return res;

  // !hasSession 非自动登录，就直接取消继续获取 session
  // 如testSession 就不用再获取 session
  if (!autoLogin) return null;

  // comment: 没有 session 才会到这一步，先获取 session，再请求
  const success = await LoginByTaro();
  if (success && serviceStore.sessionID) {
    return await fetch.post(url, data, ejectCookies([serviceStore.sessionID]));
  }
  return null;
}

/**
 * @deprecated
 * 检查有无 session
 * @returns 状态
 */
function checkSession(): boolean {
  return (serviceStore.sessionID && serviceStore.sessionID !== "") || false;
}

/**
 * @deprecated
 * 检查 session 对应的微信用户有没有激活记录
 * @returns 状态
 */
async function testSession(): Promise<boolean> {
  if (checkSession()) {
    const res = await UserService.getUserInfo(false);
    // comment: 未激活状态下，若已有激活记录，则在当前设备上自动激活
    if (
      res &&
      !serviceStore.user.isActive &&
      res.data?.code === ServerCode.OK
    ) {
      store.commit("setUserInfo", res.data.user);
      return true;
    }
  }
  return false;
}

export { testSession, postWithSession };
