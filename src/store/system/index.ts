import { AppListItem } from '@/interface/AppList';
import { AnnouncementStore } from './announcement';
import { RuntimeStore } from './runtime';
export interface ISystemStore {
	loading: boolean;
	appList: Array<AppListItem>;
	announcement: any;
	generalInfo: any;
	runtime: any;
}

export const SystemStore = {
	modules: {
		announcement: AnnouncementStore,
		runtime: RuntimeStore
	},
	state: () => ({
		appList: undefined,
		generalInfo: undefined,
		runtime: {}
	}),
	mutations: {
		startLoading(state: any) {
			state.loading = true;
		},
		stopLoading(state: any) {
			state.loading = false;
		},
		setApplist(state: any, value) {
			state.appList = value;
		},
		clearApplist(state) {
			state.appList = undefined;
		},
		setGeneralInfo(state: any, value) {
			state.generalInfo = value;
		}
	},
	actions: {
		updateGeneralInfo(context) {
			context.commit('setGeneralInfo');
		}
	}
};
