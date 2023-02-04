import { Score } from "@/types/Score";
import { ServiceStoreType } from ".";

type ScoreServiceStoreType = ServiceStoreType["score"];

export const ScoreServiceStore = {
  state: {
    readScoreMarks: [], // 所有已读成绩的标记
    findNewScoresTime: undefined,
    scorePeriod: "期末" //记录当前成绩页面选中的期中/期末
  },

  mutations: {

    /**
     * 拆入已读成绩
     * 提取成标记存入数组
     * @param state
     * @param value 成绩
     */
    insertReadScore(
      state: ScoreServiceStoreType,
      value: Score
    ) {
      state.readScoreMarks.push({
        name: value.lessonID,
        scorePoint: value.scorePoint,
        val: true
      });
    },

    /**
     * 发现新出成绩之后的操作
     * - 标记时间
     * @param state
     */
    findNewScore(state: ScoreServiceStoreType) {
      state.findNewScoresTime = new Date();
    },

    /**
     * 更新当前选中的成绩时期（期中/期末）
     * @param state
     * @param value 更新的period
     */
    changeScorePeriod(
      state: ScoreServiceStoreType,
      value: "期中" | "期末"
      ) {
      state.scorePeriod = value;
    }

  },
};
