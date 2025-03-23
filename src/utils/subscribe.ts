import Taro from "@tarojs/taro";

export class MpSubscribeException extends Error {
  name = "MpSubscribeException";
  constructor(message: string) {
    super();
    this.message = message;
  }
}

/**
 * 尝试订阅，如果订阅被用户永久拒绝，引导用户去小程序设置中开启
 */
export async function requestMpSubscribe(tmpId: string) {
  const { subscriptionsSetting } = await Taro.getSetting({ withSubscriptions: true });

  if (!subscriptionsSetting.mainSwitch || subscriptionsSetting[tmpId] === "reject") {
    const res = await Taro.showModal({ title: "请先在设置中打开订阅消息" });
    if (res.confirm) {
      Taro.openSetting({ withSubscriptions: true });
    }
    throw new Error("需要引导用户打开订阅");
  }

  const result = await Taro.requestSubscribeMessage({
    tmplIds: [tmpId], // 微信小程序的模板 id
    entityIds: [] // 支付宝小程序的模板 id，这里为了类型正确，声明一个空数组，实际消费不到
  });

  if (result[tmpId] !== "accept") {
    // TODO: 有些 case 是模板被微信后台禁用，需要上报
    throw new MpSubscribeException(result[tmpId]);
  }
}
