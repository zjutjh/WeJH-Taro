import { api } from "../api/apiList";
import { serviceStore } from "@/store";
import request from "../request";
import Taro from "@tarojs/taro";

export default class YxyService {

  /**
   * 获取图形验证码 base64 图像
   * @returns
   */
  static getGraph = async () => {
    return request<string>(
      api.user.bind.yxy.getGraph ,{
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
      }
    );
  };

  /**
   * 校验图形验证码
   * @returns
   */
  static sendGraphAuthCode = async (
    data: { captcha: string, phoneNum: string }
  ) => {
    return request<string>(
      api.user.bind.yxy.sendGraphAuthCode, {
        method: "POST",
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
    return request<null>(
      api.user.bind.yxy.login, {
        method: "POST",
        header: {
          "Cookie": serviceStore.sessionID
        },
        data
      });
  };

  /** 查询电费余额 */
  static queryBalance = async () => {
    return request<{
      display_room_name: string;
      md_name: string;
      room_code: string;
      surplus: number; //kwh
      surplus_amount: number; // rmb
    }>(
      api.electricity.balance, {
        method: "GET",
        header: {
          "Cookie": serviceStore.sessionID
        },
      });
  };

  /** 查询用电记录 */
  static queryConsumption = async () => {
    return request<Array<{
      datetime: string;
      room_dm: string;
      used: string;
    }>>(
      api.electricity.consumption, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
      });
  };

  /** 查询缴费记录 */
  static queryRecord = async (data: {"page": string}) => {
    return request<Array<{
      buy_type: string;
      datetime: string;
      is_send: string;
      money: string;
      room_dm: string;
      using_type: string;
    }>>(
      api.electricity.record, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data: data
      });
  };

  /**
   * 查询校园卡余额
   * 可能报错易校园登录过期
   */
  static querySchoolCardBalance = async () => {
    return request<string>(
      api.card.balance, {
        method: "GET",
        header: { "Cookie": serviceStore.sessionID },
        fail: (error) => {
          console.log(error);
          Taro.showToast({
            title: `查询校园卡余额失败\r\n${error.errMsg}`,
            icon: "none"
          });
        }
      }
    );
  };

  /**
  * 查询校园卡指定日期的消费记录
  * @param data.queryTime 日期YYYYMMDD
  * e.g. `"20221210"`
  * @returns
  */
  static querySchoolCardRecord = async (
    data: { queryTime: string; }
  ) => {
    return request<Array<{
      address: string;
      deal_time: string;
      fee_name: string;
      money: string;
      serial_no: string;
      time: string;
      type: string;
    }>>(
      api.card.record, {
        method: "POST",
        header: { "Cookie": serviceStore.sessionID },
        data,
        fail: (error) => {
          console.log(error);
          Taro.showToast({
            title: `查询消费记录失败\r\n${error.errMsg}`,
            icon: "none"
          });
        }
      }
    );
  };

}
