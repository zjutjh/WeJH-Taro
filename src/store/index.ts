import Taro from "@tarojs/taro";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { ServiceStore, ServiceStoreType } from "./service";
import { SystemStore, SystemStoreType } from "./system";

const persistedStateStorage = {
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

interface StoreType {
  service: ServiceStoreType;
  system: SystemStoreType;
}

const store = createStore<StoreType>({
  modules: {
    service: ServiceStore,
    system: SystemStore
  },
  plugins: [
    createPersistedState({
      storage: persistedStateStorage
    })
  ]
});
const serviceStore = store.state.service;
const systemStore = store.state.system;

export default store;
export { serviceStore, systemStore };
