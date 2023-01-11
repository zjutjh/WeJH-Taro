import Taro from "@tarojs/taro";

/**
 * 适配苹果手机的大小
 * @returns
 */

export function isNewIPhone(): boolean {
  let info = Taro.getSystemInfoSync();
  if (!info.model) return false;
  let isNewIphone = info.model.match(
    "(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 13|iPhone 14|iPhone 15)"
  )?.length;
  return isNewIphone !== undefined && isNewIphone > 0;
}

export function scrollViewHeight(top = true, bottom = true) {
  let topHeight = "0px";
  let bottomHeight = "0px";
  if (top) topHeight = isNewIPhone() ? "87px" : "60px";
  if (bottom) bottomHeight = isNewIPhone() ? "88px" : "64px";
  return {
    height: `calc(100vh - ${topHeight} - ${bottomHeight})`
  };
}

/**
 * 实验室页面 精弘网络copyright
*/

export function getCopyRight() {
  const currentYear = new Date().getFullYear();
  return `精弘网络@${currentYear}`;
}
