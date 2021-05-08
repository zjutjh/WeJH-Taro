import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { IServiceStore, ServiceStore } from './service';
import Taro from '@tarojs/taro';
import { SystemStore } from './system';
import { AppListItem } from '@/interface/AppList';
import { Announcement } from '@/interface/Announcement';

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

interface IStore {
	service: IServiceStore;
	system: {
		loading: boolean;
		appList: Array<AppListItem>;
		announcement: { announcements: Array<Announcement> };
		generalInfo: any;
	};
}

const store = createStore<IStore>({
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
