import { createApp } from 'vue';
import './app.scss';
import Taro from '@tarojs/taro';
import store from './store/index';
import { LoginByTaro } from './services';
import { SystemService } from './services';
import dayjs from 'dayjs';
var customParseFormat = require('dayjs/plugin/customParseFormat');
var relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
dayjs.extend(customParseFormat);
var utc = require('dayjs/plugin/utc'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(relativeTime)
const App = createApp({
	onShow() {
		SystemService.getGeneralInfo();
		SystemService.getAppList();
		LoginByTaro();
	}
}).use(store);
export default App;
