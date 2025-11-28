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

/** 查询校车信息请求 */
export type QueryBusInfoREquest = {
  /** 输入框拼接字段 */
  search: string;
};

/** 查询校车信息 */
export type QueryBusInfoResponse = {
  max_page: number;
  list: Array<{
    id: string;
    name: string;
    start: string;
    end: string;
    seats: number;
    price: number;
    stations: Array<{
      id: string;
      station_name: string;
      station_seq: number;
    }>;
    bus_time: Array<{
      id: string;
      departure_time: string;
      remain_seats: number;
      ordered_seats: number;
    }>;
  }>;
};
