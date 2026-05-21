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
    /** 课程从第几节到第几节 */
    sections: string;
    lessonName: string;
    campus: string;
    lessonPlace: string;
    placeID: string;
    teacherName: string;
    className: string;
    /** 周几 */
    weekday: string;
    /** 第几周 */
    week: string;
    /** 总学时 */
    lessonHours: string;
    credits: string;
    type: string;
  }>;
  practiceLessons: Array<{
    lessonName: string;
    teacherName: string;
    /** 上课的时间。并没有写错 */
    className: string;
    credits: string;
  }>;
  info: {
    Name: string;
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

export type QueryExamRequest = QueryLessonsTableRequest;

/** 查询考试安排 */
export type QueryExamResponse = Array<{
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
}>;

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
