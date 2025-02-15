export interface Exam {
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

export interface ExamTermOption {
  /** 例如 2021 */
  year: string;
  term: "上" | "下" | "短";
}
