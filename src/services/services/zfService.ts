import { api } from "../api/apiList";
import { Lesson } from "@/types/Lesson";
import { Exam } from "@/types/Exam";
import { FinalTermScore, MidTermScore } from "@/types/Score";
import { request } from "@/utils";

export default class ZFService {
  /**
   * 从缓存中获取考试安排信息
   * @param data 指定学期
   * @returns
   */
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

  static getMidTermScore(params: { year: string, term: string }) {
    return request<MidTermScore[]>(
      api.zf.midtermscoreInfo, {
        method: "POST",
        params
      }
    );
  }

  static getFinalTermScore(params: { year: string, term: string }) {
    return request<FinalTermScore[]>(
      api.zf.examInfo, {
        method: "POST",
        params
      }
    );
  }

  static async getFreeRoomInfo(data: {
    year: string;
    term: string;
    campus: string;
    weekday: string;
    sections: string;
    week: string;
  }) {
    return updateDateStateWithSession(api.zf.freeroom, data, "setRoomInfo");
  }

  static getLessonTable(params: { year: string; term: string; }) {
    return request<{
      lessonsTable: Lesson[] | null
    }>(api.zf.lessonTable, {
      method: "POST",
      params
    });
  }
}
