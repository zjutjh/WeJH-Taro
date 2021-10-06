import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Score } from "@/types/Score";

export interface ZFServiceType {
	lessonsTable: Lesson[];
	practiceLessons: PracticeLesson[];
	examInfo: Exam[];
	scoreInfo: Score[];
	room: Array<any>;
	updateTime: {
		lessonsTable: Date;
		practiceLessons: Date;
		room: Date;
	};
}

export const ZFServiceStore = {
	state: () => ({
		lessonsTable: [],
		practiceLessons: [],
		examInfo: [],
		scoreInfo: [],
		updateTime: {
			lessonsTable: undefined,
			practiceLessons: undefined,
			room: undefined
		}
	}),
	mutations: {
		setLessonTable(state: ZFServiceType, value: { term: string; year: string; lessonsTable: Lesson[]; practiceLessons: PracticeLesson[] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.term] = {
				lessons: {
					data: {
						lessonsTable: value.lessonsTable,
						practiceLessons: value.practiceLessons
					},
					updateTime: new Date()
				}
			};
		},
		setExamInfo(state: ZFServiceType, value: { term: string; year: string; examInfo: Exam[] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.term] = {
				exam: {
					data: value.examInfo,
					updateTime: new Date()
				}
			};
		},
		setScoreInfo(state: ZFServiceType, value: { term: string; year: string; scoreInfo: Score[] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.term] = {
				score: {
					data: value.scoreInfo,
					updateTime: new Date()
				}
			};
		},
		setRoomInfo(state: ZFServiceType, value: []) {
			state.room = value;
			state.updateTime.room = new Date();
		}
	}
};
