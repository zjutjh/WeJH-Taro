import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { ServiceStore } from "./service";
import Taro from "@tarojs/taro";

const persistedStateStorage = {
  setItem(key: string, value: string) {
    return Taro.setStorageSync(key, value);
  },
  getItem(key: string) {
    return Taro.getStorageSync(key);
  },
  removeItem(key) {
    return Taro.removeStorageSync(key);
  },
};

interface IStore {
  service: any;
  view: any;
}
const store = createStore<IStore>({
  modules: {
    service: ServiceStore,
  },
  plugins: [
    createPersistedState({
      storage: persistedStateStorage,
    }),
  ],
});
const serviceStore = store.state.service;
const viewStore = store.state.view;

export default store;
export { serviceStore, viewStore };
