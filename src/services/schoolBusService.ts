import Taro from "@tarojs/taro";
import fetch from "../utils/fetch/fetch";
function loginByTaro() {
  Taro.login({ timeout: 3000 }).then((res) => {
    if (res.code) {
      fetch.post("https://test.com/onLogin", { code: res.code }).then(() => {});
    } else {
      console.log("登录失败！" + res.errMsg);
    }
  });
}

function loginByID() {
  Taro.login({ timeout: 3000 }).then((res) => {
    if (res.code) {
      //发起网络请求
      Taro.request({
        url: "https://test.com/onLogin",
        data: {
          code: res.code,
        },
      });
    } else {
      console.log("登录失败！" + res.errMsg);
    }
  });
}
export { loginByTaro, loginByID };
