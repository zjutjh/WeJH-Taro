import { Score } from "@/types/Score";
import { ServiceStoreType } from ".";

type ScoreServiceStoreType = ServiceStoreType["score"];

export const ScoreServiceStore = {
  state: {
    readScoreMarks: [], // 所有已读成绩的标记
    findNewScoresTime: undefined
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
    }

  },
};
