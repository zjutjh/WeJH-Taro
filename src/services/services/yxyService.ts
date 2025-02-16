import { api } from "@/services";
import { request } from "@/utils";

export default class YxyService {

  /**
   * 获取图形验证码 base64 图像
   * @returns
   */
  static getGraph = async () => {
    return request<string>(
      api.user.bind.yxy.getGraph, {
        method: "POST"
      }
    );
  };

  /**
   * 校验图形验证码
   * @returns
   */
  static sendGraphAuthCode = async (
    params: { captcha: string, phoneNum: string }
  ) => {
    return request<string>(
      api.user.bind.yxy.sendGraphAuthCode, {
        method: "POST",
        params
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
    params: { phoneNum: string, code: string }
  ) => {
    return request<null>(
      api.user.bind.yxy.login, {
        method: "POST",
        params
      });
  };

  /** 查询电费余额 */
  static queryBalance = async (params: {
    campus: string
  }) => {
    return request<{
      display_room_name: string;
      room_str_concat: string;
      /** kwh */
      soc: number;
    }>(api.electricity.balance, {
      params
    });
  };

  /** 查询用电记录 */
  static queryConsumption = async (params: {
    campus: string;
  }) => {
    return request<Array<{
      datetime: string;
      room_dm: string;
      used: string;
    }>>(api.electricity.consumption, {
      params
    });
  };

  /** 申请订阅电费警告 */
  static queryElectricitySubscription = async () => {
    return request<null>(
      api.electricity.subscription, {
        method: "POST"
      });
  };

  /** 查询缴费记录 */
  static queryRecord = async (params: {
    page: string;
    campus: string;
  }) => {
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
        params
      });
  };

  /**
   * 查询校园卡余额
   * 可能报错易校园登录过期
   */
  static querySchoolCardBalance = async () => {
    return request<string>(api.card.balance);
  };

  /**
  * 查询校园卡指定日期的消费记录
  * @param data.queryTime 日期YYYYMMDD
  * e.g. `"20221210"`
  * @returns
  */
  static querySchoolCardRecord = async (
    params: { queryTime: string; }
  ) => {
    return request<Array<{
      address: string;
      deal_time: string;
      fee_name: string;
      money: string;
      serial_no: string;
      time: string;
      type: string;
    }> | null>(
      api.card.record, {
        method: "POST",
        params
      }
    );
  };
}
