import { updateDateStateWithSession } from '../utils/updateDateState';
import { api } from '../api/apiList';
import { serviceStore, systemStore } from '@/store';
import { Lesson } from '@/types/Lesson';
import { Exam } from '@/types/Exam';
import { Score } from '@/types/Score';
export default class ZFService {
	static async updateLessonTable(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo.termYear,
				term: systemStore.generalInfo.term
			};
		}
		return updateDateStateWithSession(api.zf.lessonTable, data, 'setLessonTable', (res) => {
			res.data.data['year'] = data?.year;
			res.data.data['term'] = data?.term;
			return res.data.data;
		});
	}

	static async updateExamInfo(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		return updateDateStateWithSession(api.zf.examInfo, data, 'setExamInfo', (res) => {
			return {
				examInfo: res.data.data,
				year: data?.year,
				term: data?.term
			};
		});
	}
	static getExamInfo(data?: { year: string; term: string }): { data: Exam[]; updateTime: Date | null } {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		if (!serviceStore?.zf[data.year]) return { data: [], updateTime: null };
		if (!serviceStore?.zf[data.year][data.term]?.exam) return { data: [], updateTime: null };
		return serviceStore?.zf[data.year][data.term]?.exam;
	}

	static async updateScoreInfo(data?: { year: string; term: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		return updateDateStateWithSession(api.zf.scoreInfo, data, 'setScoreInfo', (res) => {
			return {
				scoreInfo: res.data.data,
				year: data?.year,
				term: data?.term
			};
		});
	}
	static getScoreInfo(data?: { year: string; term: string }): { data: Score[]; updateTime: Date | null } {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		if (!serviceStore?.zf[data.year]) return { data: [], updateTime: null };
		if (!serviceStore?.zf[data.year][data.term]?.score) return { data: [], updateTime: null };
		return serviceStore?.zf[data.year][data.term]?.score;
	}

	static async getFreeRoomInfo(data: { year: string; term: string; campus: string; weekday: string; section: string; week: string }) {
		return updateDateStateWithSession(api.zf.freeroom, data, 'setRoomInfo');
	}

	static getTodayLessonTable() {
		const lessonsTable = this.getLessonTable();
		let lenssons = lessonsTable?.filter((value) => {
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

	// comment: 从全局状态中取出课表
	static getLessonTable(data?: { year: string; term: string }): Lesson[] {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		if (!serviceStore?.zf[data.year]) return [];
		if (!serviceStore?.zf[data.year][data.term]?.lessons?.data.lessonsTable) return [];
		return serviceStore?.zf[data.year][data.term]?.lessons?.data.lessonsTable;
	}

	// comment: practiceLessonTable
	static getPracticeLessonsTable(data?: { year: string; term: string }): Lesson[] {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term
			};
		}
		if (!serviceStore?.zf[data.year]) return [];
		if (!serviceStore?.zf[data.year][data.term]?.lessons?.data.practiceLessons) return [];
		return serviceStore?.zf[data.year][data.term]?.lessons?.data.practiceLessons;
	}

	// comment: 获取周课表
	static getWeekLessonTable(data?: { year: string; term: string; week: string }) {
		if (!data) {
			data = {
				year: systemStore.generalInfo?.termYear,
				term: systemStore.generalInfo?.term,
				week: systemStore.generalInfo?.week
			};
		}
		const lessonsTable = this.getLessonTable(data);
		let lenssons = lessonsTable?.filter((value) => {
			if (data) {
				let v = value.week.split('-');
				let st = parseInt(v[0]);
				let ed = parseInt(v[1]);
				if (parseInt(data.week) <= ed && st >= parseInt(data.week)) {
					return true;
				}
			}
			return false;
		});
		return lenssons;
	}
}
