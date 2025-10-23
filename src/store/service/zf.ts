import { set } from "lodash-es";

import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Room } from "@/types/Room";
import { Score } from "@/types/Score";

/** 期中/期末 到值的映射 */
type PeriodValueRecord<T> = Record<"期中" | "期末", T | undefined>;

/** 学期到值的映射，分上学期和下学期 */
type TermValueRecord<T> = Record<string, T | undefined>;

/** 年份到值的映射 */
type YearValueRecord<T> = Record<string, T | undefined>;

/** 最小存储单元，带有请求成功的时间 */
type StoreDataWithUpdateTime<T> = { data: T; updateTime: Date };

interface LessonsTableData {
  lessonsTable: Lesson[];
  practiceLessons: PracticeLesson[];
}

export interface ZFServiceType {
  /** 课程表信息，按年份、学期分层 */
  lessonsTableInfo: YearValueRecord<TermValueRecord<StoreDataWithUpdateTime<LessonsTableData>>>;
  /** 考试信息，按年份、学期分层 */
  examInfo: YearValueRecord<TermValueRecord<StoreDataWithUpdateTime<Exam[]>>>;
  /** 成绩信息，按年份、学期、期中/期末分层 */
  scoreInfo: YearValueRecord<
    TermValueRecord<PeriodValueRecord<StoreDataWithUpdateTime<Score[]> | undefined>>
  >;
  /** 空教室信息 */
  roomInfo?: StoreDataWithUpdateTime<Room[]>;
}

export const ZFServiceStore = {
  state: () =>
    ({
      lessonsTableInfo: {},
      examInfo: {},
      scoreInfo: {},
      roomInfo: undefined
    }) satisfies ZFServiceType,
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
      } satisfies StoreDataWithUpdateTime<LessonsTableData>);
    },
    setExamInfo(
      state: ZFServiceType,
      value: { term: string; year: string; examInfo: Exam[] | null }
    ) {
      set(state, ["examInfo", value.year, value.term], {
        data: value.examInfo ?? [],
        updateTime: new Date()
      } satisfies StoreDataWithUpdateTime<Exam[]>);
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
      } satisfies StoreDataWithUpdateTime<Score[]>);
    },
    setRoomInfo(state: ZFServiceType, value: Room[]) {
      state.roomInfo = {
        data: value,
        updateTime: new Date()
      } satisfies StoreDataWithUpdateTime<Room[]>;
    }
  }
};
