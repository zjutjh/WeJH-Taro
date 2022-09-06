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
  mark?: boolean; // 标记冲突课程
  color?: string; // 课程颜色
}
export interface PracticeLesson {
  className: string;
  credits: string;
  lessonName: string;
  teacherName: string;
}
