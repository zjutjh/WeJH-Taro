import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Room } from "@/types/Room";
import { Score } from "@/types/Score";

export interface ZFServiceType {
  lessonsTableInfo: {
    [key: string]: {
      [key: string]: {
        data: {
          lessonsTable: Lesson[];
          practiceLessons: PracticeLesson[];
        };
        updateTime: Date;
      };
    };
  };
  examInfo: {
    [key: string]: {
      [key: string]: {
        data: Exam[];
        updateTime: Date;
      };
    };
  };
  scoreInfo: {
    [key: string]: {
      [key: string]: {
        [key: string]: {
          data: Score[];
          updateTime: Date;
        };
      };
    };
  };
  roomInfo: {
    data: Room[];
    updateTime: Date;
  };
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
        practiceLessons: PracticeLesson[];
      }
    ) {
      if (!state.lessonsTableInfo[value.year])
        state.lessonsTableInfo[value.year] = {};
      state.lessonsTableInfo[value.year][value.term] = {
        data: {
          lessonsTable: value.lessonsTable ?? [],
          practiceLessons: value.practiceLessons
        },
        updateTime: new Date()
      };
    },
    setExamInfo(
      state: ZFServiceType,
      value: { term: string; year: string; examInfo: Exam[] }
    ) {
      if (!state.examInfo[value.year]) state.examInfo[value.year] = {};
      state.examInfo[value.year][value.term] = {
        data: value.examInfo,
        updateTime: new Date()
      };
    },
    setScoreInfo(
      state: ZFServiceType,
      value: { term: string; year: string; period: "期中" | "期末"; scoreInfo: Score[] }
    ) {
      if (!value.scoreInfo) return;
      if (!state.scoreInfo[value.year])
        state.scoreInfo[value.year] = {};
      if (!state.scoreInfo[value.year][value.term])
        state.scoreInfo[value.year][value.term] = {};
      state.scoreInfo[value.year][value.term][value.period] = {
        data: value.scoreInfo.map(item => ({
          ...item,
          scorePeriod: value.period
        })),
        updateTime: new Date()
      };
    },
    setRoomInfo(state: ZFServiceType, value: []) {
      state.roomInfo = {
        data: value,
        updateTime: new Date()
      };
    }
  }
};
