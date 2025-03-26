import { ServerCode } from "../api/codes";
import Taro from "@tarojs/taro";
import store, { serviceStore } from "@/store";

export default async function errCodeHandler(code: number) {
  console.error("Error code", code);
  switch (code) {
    case ServerCode.UserNotLogin:
      if (serviceStore.user.isActive) {
        store.commit("clearUserInfo");
        await Taro.showModal({
          title: "错误",
          content: "未登录"
        });
      }
      break;
    case ServerCode.UserAlreadyExisted:
      await Taro.showModal({
        title: "提示",
        content: "用户已存在",
        confirmText: "去登录"
      });
      break;
  }
}
