import Taro from '@tarojs/taro';

export function isNewIPhone(): boolean {
  let info = Taro.getSystemInfoSync();
  if (!info.model) return false;
  console.log(info.model.toString());
  let isNewIphone = info.model.match(
    '(iPhone X|iPhone XS|iPhone 11|iPhone 12|iPhone 13|iPhone14)'
  )?.length;
  return isNewIphone !== undefined && isNewIphone > 0;
}

export function scrollViewHeight(top = true, bottom = true) {
  let topHeight = '0px';
  let bottomHeight = '0px';
  if (top) topHeight = isNewIPhone() ? '87px' : '60px';
  if (bottom) bottomHeight = isNewIPhone() ? '88px' : '64px';
  return {
    height: `calc(100vh - ${topHeight} - ${bottomHeight})`
  };
}
