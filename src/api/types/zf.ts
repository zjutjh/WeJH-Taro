import { ExamInfo } from "@/types/Exam";

export type QueryLessonsTableRequest = {
  year: string;
  term: string;
};

export type QueryLessonsTableResponse = {
  lessonsTable: Array<{
    /** 课程 ID，格式为 32 位 uppercase 的字符串，也可能为 5 位数字 */
    id: string;
    /** 教学班 ID，格式为 32 位 uppercase 的字符串 */
    classID: string;
    /** 课程从第几节到第几节 格式为 d-d，d 为 1-12 的数字 */
    sections: string;
    /** 课程名称 */
    lessonName: string;
    /** 校区 */
    campus: string;
    /** 上课地点 */
    lessonPlace: string;
    /** 场地 ID，格式为 32 位 uppercase 字符串，也可能为五位数字 */
    placeID: string;
    /** 教师名 */
    teacherName: string;
    /** 班级名 */
    className: string;
    /** 周几 格式为整数数字 */
    weekday: string;
    /** 周次 示例：14-16周 */
    week: string;
    /** 总学时 格式为整数 */
    lessonHours: string;
    /** 学分 格式为一位小数 */
    credits: string;
    /** 课程类型 格式示例：必修课,选修课 */
    type: string;
  }>;
  practiceLessons: Array<{
    /** 课程名称 */
    lessonName: string;
    /** 教师名称 */
    teacherName: string;
    /** 上课的时间。并没有写错 格式示例：1-4周 */
    className: string;
    /** 学分 格式为一位小数 */
    credits: string;
  }>;
  info: {
    /** 用户姓名 */
    Name: string;
    /** 用户所在班级 示例：2025数字媒体技术02 */
    ClassName: string;
  };
};

/** 查询期中成绩 */
export type QueryMidtermScoreResponse = Array<{
  className: string;
  credits: string;
  lessonID: string;
  lessonName: string;
  score: string;
  teacherName: string;
}>;

/** 查询考试安排 请求 */
export type QueryExamInfoRequest = {
  year: string;
  term: "上" | "下" | "短";
};

/** 查询考试安排 响应 */
export type QueryExamInfoResponse = ExamInfo[];

/** 查询期末成绩 */
export type QueryScoreResponse = Array<{
  className: string;
  credits: string;
  examType: string;
  lessonID: string;
  lessonName: string;
  lessonType: string;
  score: string;
  scorePoint: string;
  submitName: string;
  submitTime: string;
  teacherName: string;
}>;

/** 查询空教室 */
export type QueryFreeRoomResponse = Array<{
  buildName: string;
  campus: string;
  roomName: string;
  roomSeats: string;
  roomSeatsForExam: string;
  roomSize: string;
  type: string;
}>;
