import { FetchResult, fetch } from "@/utils";
import store from "@/store";
import { postWithSession } from "./session";
import { ServerCode } from "../api/codes";
import errCodeHandler from "./errHandler";
import Taro from "@tarojs/taro";

/**
 * 无 session 请求更新全局状态，系统请求专用
 * @param api
 * @param data
 * @param commitName
 * @param clearCommitName
 * @returns
 */
async function updateDateState(
  api: string,
  data: any,
  commitName: string
) {
  store.commit("startLoading");
  // comment: 更新数据前发送请求
  const res = await fetch.post(api, data);

  if (res?.statusCode !== 200) {
    Taro.showToast({ icon: "none", title: "小程序网络异常" });
    store.commit("stopLoading");
    return;
  }

  if (res.data?.code !== ServerCode.OK) {
    Taro.showToast({ icon: "none", title: res.data?.msg });
    errCodeHandler(res.data?.code);
    store.commit("stopLoading");
    return;
  }

  store.commit(commitName, res.data.data);
  store.commit("stopLoading");

  return res.data;
}

/**
 * 带 session 发送请求，并更新状态
 * @param api
 * @param data
 * @param commitName
 * @param commitData
 * @returns
 */
async function updateDateStateWithSession(
  api: string,
  data: any,
  commitName: string,
  commitData?: (res: FetchResult) => any
) {
  store.commit("startLoading");
  const res = await postWithSession(api, data);

  if (res?.statusCode !== 200) {
    Taro.showToast({ icon: "none", title: "小程序网络异常" });
    store.commit("stopLoading");
    return;
  }

  if (res.data?.code !== ServerCode.OK) {
    Taro.showToast({ icon: "none", title: res.data?.msg });
    errCodeHandler(res.data?.code);
    store.commit("stopLoading");
    return;
  }

  store.commit(commitName, commitData?.(res) || res.data.data);
  store.commit("stopLoading");

  return res.data;
}

export { updateDateState, updateDateStateWithSession };
