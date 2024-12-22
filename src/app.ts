import "event-target-polyfill";
import "yet-another-abortcontroller-polyfill";
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import "dayjs/locale/zh-cn";
import "./app.scss";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createVueQueryPluginOptions } from "./utils/vueQuery";

dayjs.locale("zh-cn");
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(relativeTime);

const App = createApp({});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
App.use(pinia);

App.use(VueQueryPlugin, createVueQueryPluginOptions());

export default App;
