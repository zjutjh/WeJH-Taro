export const ZFServicetore = {
	state: () => ({
		lessonsTable: [],
		practiceLessons: [],
		examInfo: [],
		scoreInfo: [],
		updateTime: {
			lessonsTable: undefined,
			practiceLessons: undefined
		}
	}),
	mutations: {
		setLessonTable(state: any, value: { lessonsTable: []; practiceLessons: [] }) {
			state.lessonsTable = value.lessonsTable;
			state.practiceLessons = value.practiceLessons;
			state.updateTime.lessonTable = new Date();
		},
		setExamInfo(state: any, value: []) {
			state.examInfo = value;
			state.updateTime.examInfo = new Date();
		},
		setScoreInfo(state: any, value: []) {
			state.scoreInfo = value;
			state.updateTime.scoreInfo = new Date();
		},
		setRoomInfo(state: any, value: []) {
			state.room = value;
			state.updateTime.room = new Date();
		}
	}
};
