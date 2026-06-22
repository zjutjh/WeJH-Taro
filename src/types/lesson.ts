import { QueryLessonsTableResponse } from "@/api/types/zf";

export type LessonBase = QueryLessonsTableResponse["lessonsTable"][number];

export interface Lesson extends LessonBase {
  /** 课程颜色 */
  color?: string;
  /** 层数，0为正常层，≥1为冲突层 */
  stack?: number;
}

export type PracticeLesson = QueryLessonsTableResponse["practiceLessons"][number];
