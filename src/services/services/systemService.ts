import { api } from '../api/apiList';
import { updateDateState } from '../utils/updateDateState';
import { AppListItem } from '@/types/AppList';
import { Announcement } from '@/types/Announcement';

export default class SystemService {
	static async getAnnouncement(page: number = 1, size: number = 10): Promise<Array<Announcement>> {
		return updateDateState(api.announcement, { page, size }, 'setAnnouncements', null);
	}

	static async getAppList(): Promise<AppListItem[]> {
		return updateDateState(api.applist, null, 'setApplist', 'clearApplist');
	}

	static async getGeneralInfo(): Promise<any> {
		return updateDateState(api.info, null, 'setGeneralInfo', null);
	}
}
