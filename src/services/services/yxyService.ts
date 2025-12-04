import Taro from "@tarojs/taro";

import { serviceStore } from "@/store";

import { api } from "../api/apiList";
import request from "../request";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class YxyService {
  static getPhoneCode = async (data: { phoneNum: string }) =>
    request<string>(api.user.bind.yxy.getPhoneCode, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data
    });
  /**
   * 登录
   * @param data
   * phoneNum: 手机号
   * code: 手机验证码
   * @returns
   */
  static loginYxy = async (data: { phoneNum: string; code: string }) =>
    request<null>(api.user.bind.yxy.login, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data
    });

  /**
   * 查询校园卡余额
   * 可能报错易校园登录过期
   */
  static querySchoolCardBalance = async () =>
    request<string>(api.card.balance, {
      method: "GET",
      header: { Cookie: serviceStore.sessionID },
      fail: (error) => {
        console.error(error);
        Taro.showToast({ title: `查询校园卡余额失败\r\n${error.errMsg}`, icon: "none" });
      }
    });

  /**
   * 查询校园卡指定日期的消费记录
   * @param data.queryTime 日期YYYYMMDD
   * e.g. `"20221210"`
   * @returns
   */
  static querySchoolCardRecord = async (data: { queryTime: string }) =>
    request<
      Array<{
        address: string;
        deal_time: string;
        fee_name: string;
        money: string;
        serial_no: string;
        time: string;
        type: string;
      }>
    >(api.card.record, {
      method: "POST",
      header: { Cookie: serviceStore.sessionID },
      data,
      fail: (error) => {
        console.error(error);
        Taro.showToast({ title: `查询消费记录失败\r\n${error.errMsg}`, icon: "none" });
      }
    });
}
