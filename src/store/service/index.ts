import { CardServiceStore } from './card';
import { IUser, UserServiceStore } from './user';
import { LibraryServiceStore } from './library';
import { ZFServiceStore } from './zf';
import { BorrowBooksInfo } from '@/interface/BorrowBooksInfo';
import { Lesson } from '@/interface/Lesson';
import { Exam } from '@/interface/Exam';
import { Score } from '@/interface/Score';

export interface IServiceStore {
	card: {
		balance: any;
		today: any;
		history: any;
		updateTime: {
			today: string;
			history: string;
			balance: string;
		};
	};
	user: IUser;
	sessionID: any;
	schoolBus: {};
	canteen: {
		flow: any;
		updateTime: {
			flow: string;
		};
	};
	library: {
		history: Array<BorrowBooksInfo>;
		current: Array<BorrowBooksInfo>;
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
		zf: ZFServiceStore
	},
	state: () => ({
		sessionID: undefined,
		canteen: {
			flow: undefined,
			updateTime: {
				flow: undefined
			}
		}
	}),
	mutations: {
		setSession(state: any, value) {
			state.sessionID = value;
		},
		clearSession(state) {
			state.sessionID = undefined;
		},
		setCanteenFlow(state: any, value) {
			state.canteen.flow = value;
			state.canteen.updateTime.flow = new Date();
		}
	}
};
