import { createApp } from "vue";
import "./app.scss";
import Taro from "@tarojs/taro";
import store from "./store/index";
import { LoginByTaro } from "./services/authService";
import SystemService from "./services/systemService";
const App = createApp({
  onShow(options) {
    SystemService.getApplist(true);
    LoginByTaro();
    if (process.env.TARO_ENV === "weapp") {
      Taro.onError(() => {
        console.log(Taro.getSystemInfoSync());
      });
    }
  },
}).use(store);
export default App;
