import { Exam } from "@/types/Exam";
import { Lesson, PracticeLesson } from "@/types/Lesson";
import { Room } from "@/types/Room";
import { Score } from "@/types/Score";
import { ref } from "vue";
import { defineStore } from "pinia";

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

export const useZFServiceStore = defineStore("zf", () => {
  const lessonsTableInfo = ref<ZFServiceType["lessonsTableInfo"]>();
  const practiceLessons = ref<PracticeLesson[]>();
  const examInfo = ref<ZFServiceType["examInfo"]>();
  const scoreInfo = ref<ZFServiceType["scoreInfo"]>();
  const roomInfo = ref<ZFServiceType["roomInfo"]>();

  const setLessonTable = (
    value: {
      term: string;
      year: string;
      lessonsTable: Lesson[];
      practiceLessons: PracticeLesson[];
    }
  ) => {
    if (!value.lessonsTable) {
      console.error("更新课表失败");
      return;
    }
    if (!lessonsTableInfo.value) lessonsTableInfo.value = {};
    if (!lessonsTableInfo.value[value.year])
      lessonsTableInfo.value[value.year] = {};
    lessonsTableInfo.value[value.year][value.term] = {
      data: {
        lessonsTable: value.lessonsTable,
        practiceLessons: value.practiceLessons
      },
      updateTime: new Date()
    };
  };

  const setExamInfo = (value: { term: string; year: string; examInfo: Exam[] }){
    if (examInfo.value && !examInfo.value[value.year]) examInfo.value[value.year] = {};
    if(examInfo.value) {
      examInfo.value[value.year][value.term] = {
        data: value.examInfo,
        updateTime: new Date()
      };
    }
  }

  const setScoreInfo = (value: { term: string; year: string; period: "期中" | "期末"; scoreInfo: Score[] })=>
  {
    if (scoreInfo.value) {
      if (!value.scoreInfo) return;
      if (!scoreInfo.value[value.year])
        scoreInfo.value[value.year] = {};
      if (!scoreInfo.value[value.year][value.term])
        scoreInfo.value[value.year][value.term] = {};
      scoreInfo.value[value.year][value.term][value.period] = {
        data: value.scoreInfo.map(item => ({
          ...item,
          scorePeriod: value.period
        })),
        updateTime: new Date()
      };
    }
  }

  const setRoomInfo = (value: Room[]) => {
    roomInfo.value = {
      data: value,
      updateTime: new Date()
    };
  }

  return {
    lessonsTableInfo,
    practiceLessons,
    examInfo,
    scoreInfo,
    roomInfo,
    setLessonTable,
    setExamInfo,
    setScoreInfo,
    setRoomInfo
  }
});
