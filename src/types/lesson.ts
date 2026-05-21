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
  /** 课程从第几节到第几节，格式为 d-d，d 为 1-12 的数字 */
  sections: string;
  teacherName: string;
  type: string;
  /** 第几周，格式示例：1-9周,11-16周 */
  week: string;
  /** 周几 */
  weekday: string;
  /** 课程颜色 */
  color?: string;
  /** 层数，0为正常层，≥1为冲突层 */
  stack?: number;
}

export interface PracticeLesson {
  className: string;
  credits: string;
  lessonName: string;
  teacherName: string;
}
