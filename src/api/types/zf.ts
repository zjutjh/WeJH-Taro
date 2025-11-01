export type QueryLessonsTableRequest = {
  year: string;
  term: string;
};

export type QueryLessonsTableResponse = {
  lessonsTable: Array<{
    id: string;
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
    lessonsHours: string;
    credits: string;
    type: string;
  }>;
  practiceLessons: Array<{
    lessonName: string;
    teacherName: string;
    className: string;
    credits: string;
  }>;
  info: {
    Name: string;
    ClassName: string;
  };
};

/** 查询期中成绩 */
export type QueryMidtermScoreResponse = {
  className: string;
  credits: string;
  lessonID: string;
  lessonName: string;
  score: string;
  teacherName: string;
};

/** 查询考试安排 */
export type QueryExamResponse = {
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
};

/** 查询期末成绩 */
export type QueryScoreResponse = {
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
};

/** 查询空教室 */
export type QueryFreeRoomResponse = {
  buildName: string;
  campus: string;
  roomName: string;
  roomSeats: string;
  roomSeatsForExam: string;
  roomSize: string;
  type: string;
};
