import Taro from "@tarojs/taro";

export const persistedStorage = {
  setItem(key: string, value: any) {
    return Taro.setStorageSync(key, value);
  },
  getItem(key: string) {
    return Taro.getStorageSync(key);
  },
  removeItem(key: string) {
    return Taro.removeStorageSync(key);
  }
};
