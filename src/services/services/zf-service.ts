import { get } from "lodash-es";

import { serviceStore, systemStore } from "@/store";
import { Score } from "@/types/Score";

import { api } from "../api/apiList";
import { updateDateStateWithSession } from "../utils/updateDateState";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ZFService {
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
