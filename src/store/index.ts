import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { useSystemStore } from "./system";
import { useServiceStore } from "./service";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export {
  useSystemStore,
  useServiceStore
};
