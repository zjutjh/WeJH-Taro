import { ServerCode } from "../api/codes";
import Taro from "@tarojs/taro";
import store, { serviceStore } from "@/store";

// comment: 微信相关登录异常处理
export default async function errCodeHandler(code: number, showModal = true) {
  console.log("Error code", code);
  if (showModal)
    switch (code) {
    case ServerCode.UsernamePasswordUnmatched:
      await Taro.showToast({
        icon: "none",
        title: "密码错误"
      });
      break;
    case ServerCode.UserNotLogin:
      if (serviceStore.user.isActive) {
        store.commit("clearUserInfo");
        await Taro.showModal({
          title: "错误",
          content: "未登录"
        });
      }
      break;
    case ServerCode.SystemError:
      await Taro.showToast({
        icon: "none",
        title: "服务器暂不可用"
      });
      break;
    case ServerCode.UserAlreadyExisted:
      await Taro.showModal({
        title: "提示",
        content: "用户已存在",
        confirmText: "去登录",
        success: (res) => {
          console.log("res", res);
        }
      });
      break;
    case ServerCode.activation.passportExisted:
      await Taro.showToast({
        icon: "none",
        title: "通行证已存在"
      });
      break;
    case ServerCode.activation.schoolIdOrIdNotExistNotMatch:
      await Taro.showToast({
        icon: "none",
        title: "学号或身份证号不存在或者不匹配"
      });
      break;
    case ServerCode.activation.passwordLenghtError:
      await Taro.showToast({
        icon: "none",
        title: "密码长度请在6~20位之间"
      });
      break;
    case ServerCode.activation.schooldIdError:
      await Taro.showToast({
        icon: "none",
        title: "学号格式错误"
      });
      break;
    default:
      if (process.env.NODE_ENV === "development")
        await Taro.showToast({
          icon: "none",
          title: `${code}`
        });
      break;
    }
}
