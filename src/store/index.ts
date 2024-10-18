import { createPinia, defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useSystemStore } from "./system";
import { useServiceStore } from "./service";
import { persistedStateStorage } from "../utils/storage";


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const useMainStore = defineStore(
  "main",
  () => {
    return {
      useSystemStore,
      useServiceStore
    };
  },
  { persist: {
    storage: persistedStateStorage
  } }
);
