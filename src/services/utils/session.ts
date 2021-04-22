import { ejectCookies } from "../../utils/cookie/cookie";
import { serviceStore } from "../../store";
import fetch, { FetchResult } from "../../utils/fetch/fetch";
import UserService from "../userServices";

function postWithSession(url: string): Promise<FetchResult> {
  if (checkSession()) {
    return fetch.post(url, null, ejectCookies([serviceStore.sessionID]));
  }
  return Promise.reject();
}
function checkSession(): boolean {
  return serviceStore.sessionID && serviceStore.sessionID !== "";
}

async function testSession(): Promise<boolean> {
  if (checkSession()) {
    return UserService.getUserInfo(true);
  }
  return false;
}

export { testSession, postWithSession };
