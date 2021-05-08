import { updateDateStateWithSession } from '../utils/updateDateState';
import { api } from '../api/apiList';
import { serviceStore, systemStore } from '@/store';
export default class ZFService {
	static async getLessonTable(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
		}
		return updateDateStateWithSession(api.zf.lessonTable, data, 'setLessonTable', null);
	}

	static async getExamInfo(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
		}
		return updateDateStateWithSession(api.zf.examInfo, data, 'setExamInfo', null);
	}

	static async getScoreInfo(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
		}
		return updateDateStateWithSession(api.zf.scoreInfo, data, 'setScoreInfo', null);
	}

	static async getFreeRoomInfo(data: { year: string; term: string; campus: string; weekday: string; section: string; week: string }) {
		return updateDateStateWithSession(api.zf.freeroom, data, 'setRoomInfo', null);
	}

	static getTodayLessonTable() {
		if (!serviceStore.zf || !serviceStore.zf.lessonsTable) return [];
		let lenssons = serviceStore.zf.lessonsTable.filter((value) => {
			let v = value.week.split('-');
			let st = parseInt(v[0]);
			let ed = parseInt(v[1]);

			let isOddWeek = value.week.includes('单');
			let isEvenWeek = value.week.includes('双');

			let currentWeek = systemStore.generalInfo.week;
			if (isOddWeek && currentWeek % 2 === 0) return false;
			if (isEvenWeek && currentWeek % 2 === 1) return false;

			let currentDay = new Date().getDay();
			if (currentDay == 0) currentDay = 7;

			if (currentWeek <= ed && currentWeek >= st) if (parseInt(value.weekday) === currentDay) return true;
		});
		return lenssons;
	}
}
