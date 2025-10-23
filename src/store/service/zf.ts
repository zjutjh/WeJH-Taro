import { set } from "lodash-es";

import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Room } from "@/types/Room";
import { Score } from "@/types/Score";

type EveryTermValueRecord<T> = Record<string, T | undefined>;
type EveryYearValueRecord<T> = Record<string, EveryTermValueRecord<T> | undefined>;

type Data<T> = { data: T; updateTime: Date };
type LessonsTableData = Data<{ lessonsTable: Lesson[]; practiceLessons: PracticeLesson[] }>;
type ExamData = Data<Exam[]>;
type ScoreData = Data<Score[]>;
type RoomData = Data<Room[]>;

export interface ZFServiceType {
  lessonsTableInfo: EveryYearValueRecord<LessonsTableData>;
  examInfo: EveryYearValueRecord<ExamData>;
  scoreInfo: EveryYearValueRecord<{
    [key: string]: ScoreData | undefined;
  }>;
  roomInfo: RoomData;
}

export const ZFServiceStore = {
  state: () => ({
    lessonsTableInfo: {},
    practiceLessons: [],
    examInfo: {},
    scoreInfo: {},
    roomInfo: {}
  }),
  mutations: {
    setLessonTable(
      state: ZFServiceType,
      value: {
        term: string;
        year: string;
        lessonsTable: Lesson[] | null;
        practiceLessons: PracticeLesson[] | null;
      }
    ) {
      set(state, ["lessonsTableInfo", value.year, value.term], {
        data: {
          lessonsTable: value.lessonsTable ?? [],
          practiceLessons: value.practiceLessons ?? []
        },
        updateTime: new Date()
      } satisfies LessonsTableData);
    },
    setExamInfo(
      state: ZFServiceType,
      value: { term: string; year: string; examInfo: Exam[] | null }
    ) {
      set(state, ["examInfo", value.year, value.term], {
        data: value.examInfo ?? [],
        updateTime: new Date()
      } satisfies ExamData);
    },
    setScoreInfo(
      state: ZFServiceType,
      value: { term: string; year: string; period: "期中" | "期末"; scoreInfo: Score[] | null }
    ) {
      set(state, ["scoreInfo", value.year, value.term, value.period], {
        data:
          value.scoreInfo?.map((item) => ({
            ...item,
            scorePeriod: value.period
          })) ?? [],
        updateTime: new Date()
      } satisfies ScoreData);
    },
    setRoomInfo(state: ZFServiceType, value: []) {
      state.roomInfo = {
        data: value,
        updateTime: new Date()
      };
    }
  }
};
