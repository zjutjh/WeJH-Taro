import { api } from '../api/apiList';
import { updateDateState } from '../utils/updateDateState';
import { AppListItem } from '@/interface/AppList';
import { Announcement } from '@/interface/Announcement';

export default class SystemService {
	static async getAnnouncement(): Promise<Array<Announcement>> {
		return updateDateState(api.announcement, null, 'setAnnouncements', null);
	}

	static async getAppList(): Promise<Array<AppListItem>> {
		return updateDateState(api.applist, null, 'setApplist', 'clearApplist');
	}

	static async getGeneralInfo(): Promise<any> {
		return updateDateState(api.info, null, 'setGeneralInfo', null);
	}
}
