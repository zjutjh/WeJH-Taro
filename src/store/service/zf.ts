import { set } from "lodash-es";

import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Room } from "@/types/Room";
import { Score } from "@/types/Score";

type EveryTermValueRecord<T> = Record<string, T | undefined>;
type EveryYearValueRecord<T> = Record<string, EveryTermValueRecord<T> | undefined>;

export interface ZFServiceType {
  lessonsTableInfo: EveryYearValueRecord<{
    data: {
      lessonsTable: Lesson[];
      practiceLessons: PracticeLesson[];
    };
    updateTime: Date;
  }>;
  examInfo: EveryYearValueRecord<{
    data: Exam[];
    updateTime: Date;
  }>;
  scoreInfo: EveryYearValueRecord<{
    [key: string]:
      | {
          data: Score[];
          updateTime: Date;
        }
      | undefined;
  }>;
  roomInfo: {
    data: Room[];
    updateTime: Date | null;
  };
}

export const ZFServiceStore = {
  state: () => ({
    lessonsTableInfo: {},
    practiceLessons: [],
    examInfo: {},
    scoreInfo: {},
    roomInfo: {
      data: [],
      updateTime: null
    }
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
      });
    },
    setExamInfo(
      state: ZFServiceType,
      value: { term: string; year: string; examInfo: Exam[] | null }
    ) {
      set(state, ["examInfo", value.year, value.term], {
        data: value.examInfo ?? [],
        updateTime: new Date()
      });
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
      });
    },
    setRoomInfo(state: ZFServiceType, value: []) {
      state.roomInfo = {
        data: value,
        updateTime: new Date()
      };
    }
  }
} satisfies {
  state: () => ZFServiceType;
  mutations: Record<string, (state: ZFServiceType, value: object | []) => void>;
};
