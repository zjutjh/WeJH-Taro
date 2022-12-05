import { updateDateStateWithSession } from '../utils/updateDateState';
import { api } from '../api/apiList';
import { serviceStore, systemStore } from '@/store';
import { Lesson, PracticeLesson } from '@/types/Lesson';
import { Exam } from '@/types/Exam';
import { Score } from '@/types/Score';
export default class ZFService {
  static async updateLessonTable(data?: { year: string; term: string }) {
    if (!data) {
      data = {
        year: systemStore.generalInfo.termYear,
        term: systemStore.generalInfo.term
      };
    }
    return updateDateStateWithSession(
      api.zf.lessonTable,
      data,
      'setLessonTable',
      (res: any) => {
        res.data.data['year'] = data?.year;
        res.data.data['term'] = data?.term;
        return res.data.data;
      }
    );
  }

  static async updateExamInfo(data?: { year: string; term: string }) {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    return updateDateStateWithSession(
      api.zf.examInfo,
      data,
      'setExamInfo',
      (res) => {
        return {
          examInfo: res.data.data,
          year: data?.year,
          term: data?.term
        };
      }
    );
  }
  static getExamInfo(data?: { year: string; term: string }): {
    data: Exam[];
    updateTime: Date | null;
  } {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    if (!serviceStore?.zf.examInfo[data.year])
      return { data: [], updateTime: null };
    if (!serviceStore?.zf.examInfo[data.year][data.term]?.data)
      return { data: [], updateTime: null };
    return serviceStore?.zf.examInfo[data.year][data.term];
  }

  static async updateScoreInfo(data?: { year: string; term: string }) {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    return updateDateStateWithSession(
      api.zf.scoreInfo,
      data,
      'setScoreInfo',
      (res) => {
        return {
          scoreInfo: res.data.data,
          year: data?.year,
          term: data?.term
        };
      }
    );
  }
  static getScoreInfo(data?: { year: string; term: string }): {
    data: Score[];
    updateTime: Date | null;
  } {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    if (!serviceStore?.zf.scoreInfo[data.year])
      return { data: [], updateTime: null };
    if (!serviceStore?.zf.scoreInfo[data.year][data.term]?.data)
      return { data: [], updateTime: null };
    return serviceStore?.zf.scoreInfo[data.year][data.term];
  }

  static async getFreeRoomInfo(data: {
    year: string;
    term: string;
    campus: string;
    weekday: string;
    sections: string;
    week: string;
  }) {
    return updateDateStateWithSession(api.zf.freeroom, data, 'setRoomInfo');
  }

  static getTodayLessonTable() {
    const lessonsTable = this.getLessonTable();
    let lessons = lessonsTable?.filter((item: Lesson) => {
      let currentDay = new Date().getDay() || 7;
      if (currentDay !== parseInt(item.weekday)) return false;
      let currentWeek = systemStore.generalInfo.week;

      for (const time of item.week.split(',')) {
        if (time.includes('-')) {
          const start = parseInt(time.split('-')[0]);
          const end = parseInt(time.split('-')[1]);
          if (currentWeek <= end && currentWeek >= start)
            if (!time.includes('单') && !time.includes('双')) return true;
            else if (time.includes('单') && currentWeek % 2 === 1) return true;
            else if (time.includes('双') && currentWeek % 2 === 0) return true;
        } else if (currentWeek === parseInt(time)) return true;
      }
      return false;
    });

    return lessons;
  }

  // comment: 从全局状态中取出课表
  static getLessonTable(data?: {
    year: string;
    term: string;
  }): Lesson[] | undefined {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    if (!serviceStore?.zf.lessonsTableInfo[data.year]) return undefined;
    if (!serviceStore?.zf.lessonsTableInfo[data.year][data.term])
      return undefined;
    return (
      serviceStore?.zf.lessonsTableInfo[data.year][data.term]?.data
        ?.lessonsTable || []
    );
  }

  // comment: practiceLessonTable
  static getPracticeLessonsTable(data?: {
    year: string;
    term: string;
  }): PracticeLesson[] {
    if (!data) {
      data = {
        year: systemStore.generalInfo?.termYear,
        term: systemStore.generalInfo?.term
      };
    }
    if (!serviceStore?.zf.lessonsTableInfo[data.year]) return [];
    return (
      serviceStore?.zf.lessonsTableInfo[data.year][data.term]?.data
        ?.practiceLessons || []
    );
  }
}
