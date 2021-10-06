import { CardServiceStore, CardServiceType } from './card';
import { UserType, UserServiceStore } from './user';
import { LibraryServiceStore } from './library';
import { ZFServiceStore } from './zf';
import { BorrowBooksInfo } from '@/types/BorrowBooksInfo';
import { Lesson } from '@/types/Lesson';
import { Exam } from '@/types/Exam';
import { Score } from '@/types/Score';
import { AnnouncementStore, AnnouncementType } from './announcement';
import { AppListItem } from '@/types/AppList';
import { CanteenServiceStore } from './canteen';

export interface ServiceStoreType {
	appList?: AppListItem[];
	card: CardServiceType;
	user: UserType;
	sessionID?: string;
	schoolBus: {};
	announcement: AnnouncementType;
	canteen: {
		flow: any;
		updateTime: {
			flow: string;
		};
	};
	library: {
		history: BorrowBooksInfo[];
		current: BorrowBooksInfo[];
		updateTime: { history: string; current: string };
	};
	zf: {
		lessonsTable: Array<Lesson>;
		practiceLessons: [];
		examInfo: Array<Exam>;
		scoreInfo: Array<Score>;
		room: Array<any>;
		updateTime: {
			lessonsTable: string;
			practiceLessons: string;
		};
	};

}

export const ServiceStore = {
	modules: {
		card: CardServiceStore,
		user: UserServiceStore,
		library: LibraryServiceStore,
		zf: ZFServiceStore,
		announcement: AnnouncementStore,
		canteen: CanteenServiceStore
	},
	state: () => ({
		sessionID: undefined,
	}),
	mutations: {
		setSession(state: ServiceStoreType, value) {
			state.sessionID = value;
		},
		clearSession(state: ServiceStoreType) {
			state.sessionID = undefined;
		},
		setApplist(state: ServiceStoreType, value) {
			state.appList = value;
		},
		clearApplist(state: ServiceStoreType) {
			state.appList = undefined;
		},
	}
};
