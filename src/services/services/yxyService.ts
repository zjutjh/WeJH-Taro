import Taro from "@tarojs/taro";
import { api } from "../api/apiList";
import { serviceStore } from "@/store";

interface IResponse<T> {
  code: number;
  msg: string;
  data: T
}

export default class YxyService {

  /**
   * 请求获取手机验证码
   * @param data phoneNum: 手机号码
   * @returns
   */
  static sendPhoneAuthCode = async (
    data: { phoneNum: string }
  ) => {
    return Taro.request({
      method: "POST",
      url: api.user.bind.yxy.sendPhoneNumber,
      header: {
        "Cookie": serviceStore.sessionID
      },
      data
    });
  };

  /**
   * 获取图形验证码 base64 图像
   * @returns
   */
  static getGraph = async () => {
    return Taro.request<IResponse<string>>({
      url: api.user.bind.yxy.getGraph,
      method: "POST",
      header: {
        "Cookie": serviceStore.sessionID
      },
    });
  };

  /**
   * 校验图形验证码
   * @returns
   */
  static sendGraphAuthCode = async (
    data: { captcha: string, phoneNum: string }
  ) => {
    return Taro.request({
      method: "POST",
      url: api.user.bind.yxy.sendGraphAuthCode,
      header: {
        "Cookie": serviceStore.sessionID
      },
      data
    });
  };

  /**
   * 登录
   * @param data
   * phoneNum: 手机号
   * code: 手机验证码
   * @returns
   */
  static loginYxy = async (
    data: { phoneNum: string, code: string }
  ) => {
    return Taro.request({
      method: "POST",
      url: api.user.bind.yxy.login,
      header: {
        "Cookie": serviceStore.sessionID
      },
      data
    });
  };

  /**
   * 查询电费
   * @returns
   */
  static queryBalance = async () => {
    return Taro.request({
      method: "GET",
      url: api.electricity.balance,
      header: {
        "Cookie": serviceStore.sessionID
      },
    });
  };

  // static async getBalance() : {balance: String | undefined}  {
  //   if (serviceStore.electricity.balance) {
  //     return {balance: serviceStore.electricity.balance.toString()};
  //   }
  //   else {
  //     const ans = await YxyService.queryBalance();
  //     if(ans.data?.data?.balance)
  //       return {balance: serviceStore.electricity.balance};
  //     else
  //       return{balance: undefined};
  //   }
  // };

  static queryConsumption = async () => {
    return Taro.request({
      method: "GET",
      url: api.electricity.consumption,
      header: {
        "Cookie": serviceStore.sessionID
      },
    });
  };

  static queryRecord = async (data: {"page": string}) => {
    return Taro.request({
      method: "POST",
      url: api.electricity.record,
      header: {
        "Cookie": serviceStore.sessionID
      },
      data: data
    });
  };

}
