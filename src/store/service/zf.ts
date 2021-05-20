export const ZFServiceStore = {
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
		setLessonTable(state: any, value: { term: string; year: string; lessonsTable: []; practiceLessons: [] }) {
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
		setExamInfo(state: any, value: { term: string; year: string; examInfo: [] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.term] = {
				exam: {
					data: value.examInfo,
					updateTime: new Date()
				}
			};
		},
		setScoreInfo(state: any, value: { term: string; year: string; scoreInfo: [] }) {
			if (!state[value.year]) state[value.year] = {};
			state[value.year][value.term] = {
				score: {
					data: value.scoreInfo,
					updateTime: new Date()
				}
			};
		},
		setRoomInfo(state: any, value: []) {
			state.room = value;
			state.updateTime.room = new Date();
		}
	}
};
