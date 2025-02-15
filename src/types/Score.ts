export type ScoreBase = {
  className: string;
  credits: string;
  lessonID: string;
  lessonName: string;
  score: string;
  teacherName: string;
};

export type FinalTermScore = ScoreBase & {
  examType: string;
  lessonType: string;
  scorePoint: string;
  submitName: string;
  submitTime: string;
};

export type MidTermScore = ScoreBase;

export interface ScoreTermOption {
  /** 例如 2021 */
  year: string;
  term: "上" | "下" | "短";
  period: "期中" | "期末";
}
