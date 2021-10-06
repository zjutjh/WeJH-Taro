export interface Lesson {
	campus: string;
	classID: string;
	className: string;
	credits: string;
	id: string;
	lessonHours: string;
	lessonName: string;
	lessonPlace: string;
	placeID: string;
	sections: string;
	teacherName: string;
	type: string;
	week: string;
	weekday: string;
}
export interface PracticeLesson {
	className: string;
	credits: string;
	lessonName: string;
	teacherName: string;
}