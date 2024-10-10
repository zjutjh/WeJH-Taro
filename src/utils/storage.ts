import Taro from "@tarojs/taro";

export const persistedStateStorage = {
  setItem(key: string, value: string) {
    return Taro.setStorageSync(key, value);
  },
  getItem(key: string) {
    return Taro.getStorageSync(key);
  },
  removeItem(key) {
    return Taro.removeStorageSync(key);
  }
};
