// 查询课表
export interface LessonsTableResponse {
  lessonsTable: Array<{
    id: string;
    sections: string;
    lessonName: string;
    campus: string;
    lessonPlace: string;
    placeID: string;
    teacherName: string;
    className: string;
    weekday: string;
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
}

// 查询期中成绩
export interface midtermScoreResponse {
  className: string;
  credits: string;
  lessonID: string;
  lessonName: string;
  score: string;
  teacherName: string;
}

// 查询考试安排
export interface ExamResponse {
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

// 查询期末成绩
export interface ScoreResponse {
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
}

// 查询空教室
export interface RoomResponse {
  buildName: string;
  campus: string;
  roomName: string;
  roomSeats: string;
  roomSeatsForExam: string;
  roomSize: string;
  type: string;
}
