import "dayjs/locale/zh-cn";
import "./app.scss";
import "event-target-polyfill";
import "yet-another-abortcontroller-polyfill";
import "@/plugins/aegis";

import { VueQueryPlugin } from "@tanstack/vue-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import { LoginByTaro, SystemService } from "./services";
import store from "./store/index";
import { globalQueryClient } from "./utils/vue-query";

dayjs.locale("zh-cn");
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(relativeTime);

const App = createApp({
  mounted() {
    SystemService.getGeneralInfo();
    SystemService.getAppList();
    LoginByTaro();
  }
})
  .use(store)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(VueQueryPlugin, { queryClient: globalQueryClient });

export default App;
