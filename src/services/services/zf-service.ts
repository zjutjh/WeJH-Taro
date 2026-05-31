import { get } from "lodash-es";

import { serviceStore, systemStore } from "@/store";
import { Exam } from "@/types/Exam";
import { Score } from "@/types/Score";

import { api } from "../api/apiList";
import { updateDateStateWithSession } from "../utils/updateDateState";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ZFService {
  static async updateExamInfo(data?: { year: string; term: string }) {
    data ??= {
      year: systemStore.generalInfo.termYear,
      term: systemStore.generalInfo.term
    };

    return updateDateStateWithSession(api.zf.examInfo, data, "setExamInfo", (res) => ({
      examInfo: res.data.data, // 和store/service/zf.ts 相对应
      year: data.year,
      term: data.term
    }));
  }

  /**
   * 从缓存中获取考试安排信息
   * @param data 指定学期
   * @returns
   */
  static getExamInfo(data?: { year: string; term: string }): {
    data: Exam[];
    updateTime: Date | null;
  } {
    // 若不手动调用, 则采用默认值
    data ??= {
      year: systemStore.generalInfo.termYear,
      term: systemStore.generalInfo.term
    };

    // 直接得到考试安排信息
    return {
      data: get(serviceStore, ["zf", "examInfo", data.year, data.term, "data"], []),
      updateTime: get(serviceStore, ["zf", "examInfo", data.year, data.term, "updateTime"], null)
    };
  }

  static async updateScoreInfo(data?: { year: string; term: string; period: "期中" | "期末" }) {
    data ??= {
      year: systemStore.generalInfo.termYear,
      term: systemStore.generalInfo.term,
      period: serviceStore.score.scorePeriod
    };

    if (data.period === "期末")
      return updateDateStateWithSession(api.zf.scoreInfo, data, "setScoreInfo", (res) => ({
        scoreInfo: res.data.data,
        year: data.year,
        term: data.term,
        period: "期末"
      }));

    return updateDateStateWithSession(api.zf.midtermscoreInfo, data, "setScoreInfo", (res) => ({
      scoreInfo: res.data.data,
      year: data.year,
      term: data.term,
      period: "期中"
    }));
  }

  static getScoreInfo(data: { year: string; term: string; period: "期中" | "期末" }): {
    data: Score[];
    updateTime: Date | null;
  } {
    return get(serviceStore, ["zf", "scoreInfo", data.year, data.term, data.period], {
      data: [],
      updateTime: null
    });
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
}
