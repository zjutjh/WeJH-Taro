import { createApp } from 'vue';
import store from './store/index';
import { LoginByTaro } from './services';
import { SystemService } from './services';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tabbar, TabbarItem, Icon } from '@nutui/nutui-taro';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import 'dayjs/locale/zh-cn';
import '@nutui/nutui-taro/dist/styles/themes/default.scss';
import './app.scss';
dayjs.locale('zh-cn');
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(relativeTime);
const App = createApp({
	onShow() {
		SystemService.getGeneralInfo();
		SystemService.getAppList();
		LoginByTaro();
	}
}).use(store).use(Tabbar).use(TabbarItem).use(Icon);
export default App;
