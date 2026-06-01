import dayjs from "dayjs";

import { DiffTimeReturn } from "@/utils";

/** 考试安排 */
export interface ExamInfo {
  campus: string;
  className: string;
  credits: string;
  examPlace: string;
  examTime: string;
  id: string;
  lessonName: string;
  lessonPlace: string;
  seatNum: string;
  teacherName: string;
}

/** 考试信息（字段拓展） */
export interface ExamInfoExtended extends ExamInfo {
  meta: {
    /** 考试开始时间 */
    startAt: dayjs.Dayjs;
    /** 考试结束时间 */
    endAt: dayjs.Dayjs;
    /** 考试开始时间距今（精确到分钟） */
    startAtDiff: DiffTimeReturn;
  };
}
